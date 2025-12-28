```markdown
# BEYBLADE WhatsApp Bot (Baileys) - Template

Ce dépôt contient un bot WhatsApp simple basé sur [Baileys](https://github.com/adiwajshing/Baileys). L'objectif : fournir un template que tout le monde peut cloner et déployer facilement, avec un gestionnaire de commandes et un script pour générer jusqu'à 150 commandes d'exemple.

## Fonctionnalités
- Connexion Baileys (scan QR la première fois)
- Gestionnaire de commandes (préfix configurable)
- Commandes modulaires dans `/commands`
- Script pour générer X commandes d'exemple
- Dockerfile + docker-compose pour déployer facilement

## Installation locale
1. Clone le repo
   git clone https://github.com/TON_COMPTE/BEYBLADE-V1.git
2. Installe:
   npm install
3. Copie le fichier d'exemple `.env.example` en `.env` et remplis :
   - PREFIX
   - SESSION_FILE (par défaut ./auth_info_multi.json)
   - PARAINE_CODE (ton code parrainé si tu veux l'utiliser dans des commandes)
4. Lancer:
   npm start
   - La première fois, un QR s'affichera dans la console. Scanne avec ton application WhatsApp (compte autorisé).

## Générer 150 commandes d'exemple
Pour créer 150 fichiers de commandes d'exemple :
npm run generate:commands
ou
node tools/generate-commands.js

Cela crée des fichiers `commands/*.js`. Chaque fichier répondra avec un message simple.

## Déploiement Docker
1. Construire l'image:
   docker build -t beyblade-wa-bot .
2. Lancer avec volume pour conserver la session:
   docker run -v $(pwd)/auth:/app/auth -e SESSION_FILE=/app/auth/auth_info_multi.json beyblade-wa-bot

Ou utilise docker-compose (voir docker-compose.yml).

## Rendre le dépôt utilisable par tout le monde
- Active "Template repository" dans les settings GitHub pour permettre le bouton "Use this template".
- Documente les variables d'environnement dans README.
- Fournis un fichier `.env.example`.
- Ajoute un guide de déploiement (Railway/Heroku/VPS/Docker).

## À propos du code parrainé / numéro WhatsApp
- Si tu veux que le bot envoie automatiquement un message contenant `parrainé-code=XXXX` vers un numéro, stocke le code et le numéro dans `.env` (PARAINE_CODE, DEFAULT_TARGET_NUMBER) et crée une commande (ex: `!parrain`) qui envoie ce message.
- Exemple de commande d'envoi automatique (créée manuellement) :
```js
module.exports = {
  name: 'parrain',
  description: 'Envoie le code parrain',
  async execute(sock, msg, args) {
    const code = process.env.PARAINE_CODE || 'vide';
    const target = process.env.DEFAULT_TARGET_NUMBER;
    if (!target) return sock.sendMessage(msg.key.remoteJid, { text: 'DEFAULT_TARGET_NUMBER non défini dans .env' }, { quoted: msg });
    await sock.sendMessage(target, { text: 'parrainé-code=' + code });
    await sock.sendMessage(msg.key.remoteJid, { text: 'Message envoyé à ' + target }, { quoted: msg });
  }
};
```

## Sécurité & bonnes pratiques
- Ne committe jamais `.env` ni les fichiers d'auth (auth_info*).
- Garde le fichier d'auth hors du repo (volume Docker).
- Respecte les conditions d'utilisation de WhatsApp.

## Prochaines étapes (je peux faire pour toi)
- Personnaliser les commandes (ajouter modération, stickers, médias).
- Convertir en TypeScript.
- Ajouter GitHub Actions pour tests/CI.
- Créer un script de déploiement "one-click" (Railway/Heroku) et un template GitHub prêt à l'emploi.
- Implémenter une page d'administration et des commandes modulaires avancées.
```
