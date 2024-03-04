FROM node:21-bullseye-slim

WORKDIR /src

COPY package*.json .

RUN npm install

COPY . .

CMD [ "npm", "run", "start" ]
