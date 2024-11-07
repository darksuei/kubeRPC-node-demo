FROM node:lts-alpine

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

ENV NODE_ENV=production

EXPOSE 8091
EXPOSE 8092

CMD ["node", "index.js"]
