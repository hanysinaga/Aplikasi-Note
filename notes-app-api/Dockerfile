FROM node:20

WORKDIR /NOTES-APP-API

COPY package*.json ./

RUN npm install

COPY . .

ENV PORT=5000

CMD ["npm", "start"]
