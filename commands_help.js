const fs = require('fs');
const path = require('path');

module.exports = {
  name: 'help',
  description: 'Affiche la liste des commandes disponibles',
  async execute(sock, msg, args) {
    try {
      const commandsPath = path.join(__dirname);
      const files = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
      const list = files.map(f => {
        try {
          const cmd = require(path.join(commandsPath, f));
          return `• ${cmd.name} — ${cmd.description || 'sans description'}`;
        } catch (e) {
          return `• ${f} — erreur de lecture`;
        }
      }).sort().join('\n');

      const header = '📖 Liste des commandes disponibles :\n\n';
      await sock.sendMessage(msg.key.remoteJid, { text: header + list }, { quoted: msg });
    } catch (err) {
      console.error('help error', err);
    }
  }
};
