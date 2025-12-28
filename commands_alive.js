module.exports = {
  name: 'alive',
  description: 'Vérifie si le bot est actif',
  async execute(sock, msg, args) {
    try {
      const text = '✅ Bot en ligne\nUtilise ' + (process.env.PREFIX || '!') + 'help pour la liste des commandes.';
      await sock.sendMessage(msg.key.remoteJid, { text }, { quoted: msg });
    } catch (err) {
      console.error('alive error', err);
    }
  }
};
