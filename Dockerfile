FROM node:latest

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma

COPY .env.production ./.env

COPY . .

EXPOSE 3001

CMD ["npm", "run", "start"]
