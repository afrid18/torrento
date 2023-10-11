FROM node:20

WORKDIR /app

COPY package.json .
RUN npm install

COPY . .

ENV BOT_TOKEN=$BOT_TOKEN

CMD ["node", "app.js"]
