FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

ENV NODE_ENV=production

EXPOSE 8081
EXPOSE 8082

CMD ["node", "index.js"]
