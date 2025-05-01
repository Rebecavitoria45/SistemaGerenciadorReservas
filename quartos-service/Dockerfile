FROM node:latest

WORKDIR /quartos-service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000 

CMD ["node", "server.js"]
