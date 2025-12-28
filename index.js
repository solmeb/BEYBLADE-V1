const fs = require('fs');
const path = require('path');
const pino = require('pino');
const { default: makeWASocket, useSingleFileAuthState, fetchLatestBaileysVersion } = require('@adiwajshing/baileys');
require('dotenv').config();

const logger = pino({ level: process.env.LOG_LEVEL || 'info' });

// Auth state (single file)
const { state, saveState } = useSingleFileAuthState(process.env.SESSION_FILE || './auth_info_multi.json');

async function start() {
  const { version, isLatest } = await fetchLatestBaileysVersion();
  logger.info({ version, isLatest }, 'Using WA version');

  const sock = makeWASocket({
    logger,
    printQRInTerminal: true,
    auth: state,
    version
  });

  // save auth state on changes
  sock.ev.on('creds.update', saveState);

  // Load commands
  const commands = new Map();
  const commandsPath = path.join(__dirname, 'commands');
  if (fs.existsSync(commandsPath)) {
    const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
    for (const file of files) {
      try {
        const cmd = require(path.join(commandsPath, file));
        if (cmd && cmd.name) {
          commands.set(cmd.name, cmd);
          logger.info(`Loaded command: ${cmd.name}`);
        }
      } catch (err) {
        logger.error({ err, file }, 'Failed to load command');
      }
    }
  }

  const PREFIX = process.env.PREFIX || '!';

  sock.ev.on('messages.upsert', async m => {
    try {
      if (m.type !== 'notify') return;
      const msg = m.messages[0];
      if (!msg.message || (msg.key && msg.key.remoteJid === 'status@broadcast')) return;

      const jid = msg.key.remoteJid;
      // text extraction (supports extended types)
      const proto = msg.message.conversation || (msg.message.extendedTextMessage && msg.message.extendedTextMessage.text) || '';
      const text = proto.toString().trim();

      if (!text.startsWith(PREFIX)) return;

      const body = text.slice(PREFIX.length).trim();
      const args = body.split(/\s+/);
      const commandName = args.shift().toLowerCase();

      const command = commands.get(commandName);
      if (!command) {
        await sock.sendMessage(jid, { text: `Commande inconnue: ${commandName}\nTape ${PREFIX}help pour la liste.` }, { quoted: msg });
        return;
      }

      // permission checks (basic example)
      if (command.ownerOnly && process.env.OWNER_ID) {
        const ownerJid = process.env.OWNER_ID;
        if (msg.key.participant !== ownerJid && msg.key.remoteJid !== ownerJid) {
          return sock.sendMessage(jid, { text: 'Commande réservée au propriétaire.' }, { quoted: msg });
        }
      }

      await command.execute(sock, msg, args);
    } catch (err) {
      logger.error({ err }, 'Error handling message');
    }
  });

  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect } = update;
    if (connection === 'close') {
      const status = lastDisconnect?.error?.output?.statusCode;
      logger.warn({ lastDisconnect }, 'Connection closed');
      // try reconnect except when auth removed
      if (status !== 401) {
        start();
      } else {
        logger.error('Auth removed, restart and re-scan QR');
      }
    } else if (connection === 'open') {
      logger.info('Connection opened');
    }
  });

  return sock;
}

start().catch(err => {
  console.error('Failed to start', err);
  process.exit(1);
});