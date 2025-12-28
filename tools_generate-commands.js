/**
 * Générateur de fichiers de commandes à partir d'une liste brute.
 * Usage:
 *   node tools/generate-commands.js
 *
 * Le script crée des fichiers dans ./commands/ (si non existants).
 * Chaque fichier exporte { name, description, execute }.
 *
 * Il nettoie les noms (retire le point de début, remplace caractères invalides).
 */

const fs = require('fs');
const path = require('path');

const rawCommands = [
  // GÉNÉRAL (1-12)
  '.alive', '.ping', '.système', '.active', '.owner', '.menu', '.devolopcount', '.forward', '.list', '.grouplink', '.info', '.help',
  // TÉLÉCHARGEMENT (13-24)
  '.song', '.video', '.tiktok', '.facebook', '.apk', '.img', '.xnxx', '.slanimeclub', '.gamedl', '.ytmp3', '.ytmp4', '.mediafire',
  // RECHERCHE (25-36)
  '.tmdb', '.news', '.npm', '.fitgirl', '.imgsearch', '.npmweb', '.moviedb', '.randomimage', '.xnxxsearch', '.cat', '.wiki', '.google',
  // PROPRIÉTAIRE (37-48)
  '.block', '.sudoadd', '.sudodel', '.sudolist', '.unblock', '.mode', '.viewstatus', '.active', '.autorecording', '.delete', '.restart', '.eval',
  // GROUPE (49-68)
  '.join', '.leave', '.bc', '.hidetag', '.setpp', '.setname', '.setdesc', '.antilink', '.mute', '.unmute', '.kickall', '.kick@', '.tagall', '.totag', '.warn', '.delwarn', '.listwarn', '.setwelcome', '.antilinkmode', '.autoleave',
  // DIVERTISSEMENT (69-84)
  '.wink', '.poke', '.hentai', '.bite', '.joke', '.kitsune', '.wakfu', '.neko', '.slap', '.dance', '.rank', '.quote', '.meme', '.truth', '.dare', '.8ball',
  // AUTRE (85-105)
  '.getpp', '.meta', '.take', '.sticker', '.voicegpt', '.weather', '.train', '.bus', '.summary', '.aisummary', '.calc', '.translate', '.reminder', '.time', '.quoteadd', '.poll', '.wikiquote', '.youtube', '.iplookup', '.doc', '.buttonid /on/off',
  // COMMANDES EN PLUS (106-150)
  '.mutegroup [temps]', '.unmutegroup', '.antilinkwarn', '.antilinkkick', '.antispam', '.autokick', '.kickbot', '.welcomeoff', '.welcomeon', '.promote', '.demote', '.setdescimg', '.setbanner', '.tagadmins', '.tagmembers', '.totagadmins', '.totagmembers', '.listadmins', '.listbots', '.add', '.remove', '.resetwarn', '.resetallwarn', '.checkwarn', '.setlang', '.setprefix', '.getprefix', '.slowmode [temps]', '.fastmode', '.botstats', '.uptime', '.backup', '.restore', '.blacklist', '.unblacklist', '.pollresult', '.game', '.quiz', '.rps', '.mathgame', '.tictactoe', '.connect', '.disconnect', '.support', '.feedback'
];

const commandsDir = path.join(__dirname, '..', 'commands');
if (!fs.existsSync(commandsDir)) fs.mkdirSync(commandsDir, { recursive: true });

// sanitize name to valid filename & command name
function sanitize(raw) {
  // remove leading dot and trailing spaces
  let s = raw.trim();
  if (s.startsWith('.')) s = s.slice(1);
  // remove bracketed params for filename but keep them in description
  s = s.replace(/\s*\[.*?\]/g, '');
  // replace spaces and slashes and @ and other non-alnum by underscores
  s = s.replace(/[ \/\@\-\+]+/g, '_');
  // remove characters that are not alnum or underscore (keep letters with accents)
  s = s.replace(/[^a-zA-Z0-9_À-ÿçÇéÉèÈàÀùÙôÔîÎïÏüÜöÖ]/g, '');
  // lower-case
  return s.toLowerCase();
}

for (const raw of rawCommands) {
  const base = sanitize(raw);
  if (!base) continue;
  const filename = path.join(commandsDir, `${base}.js`);
  if (fs.existsSync(filename)) {
    console.log('Skipped (exists):', filename);
    continue;
  }

  const description = `Placeholder pour la commande "${raw}"`;
  const content = `module.exports = {
  name: '${base}',
  description: ${JSON.stringify(description)},
  async execute(sock, msg, args) {
    // TODO: implémenter la logique de la commande ${raw}
    // Exemple de réponse basique :
    try {
      await sock.sendMessage(msg.key.remoteJid, { text: "Commande '${raw}' reçue. (args: " + (args.join(' ') || 'aucun') + ')' }, { quoted: msg });
    } catch (err) {
      console.error('Erreur commande ${base}:', err);
    }
  }
};\n`;

  fs.writeFileSync(filename, content, { encoding: 'utf8' });
  console.log('Created', filename);
}

console.log('Génération terminée. Total demandé:', rawCommands.length);
