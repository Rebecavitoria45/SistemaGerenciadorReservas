FROM node:latest

WORKDIR /usuarios-service

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000  

CMD ["node", "server.js"]
