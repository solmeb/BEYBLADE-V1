module.exports = {
  name: 'ping',
  description: 'Répond pong (vérifie la latence)',
  async execute(sock, msg, args) {
    try {
      const start = Date.now();
      await sock.sendMessage(msg.key.remoteJid, { text: 'Pong...' }, { quoted: msg });
      const delta = Date.now() - start;
      await sock.sendMessage(msg.key.remoteJid, { text: `Pong ! Latence approximative: ${delta}ms` }, { quoted: msg });
    } catch (err) {
      console.error('ping error', err);
    }
  }
};