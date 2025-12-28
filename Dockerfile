FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --production

COPY . .

# Create a folder to store auth, must be writable
VOLUME ["/app/auth"]

ENV NODE_ENV=production

CMD ["node", "index.js"]
