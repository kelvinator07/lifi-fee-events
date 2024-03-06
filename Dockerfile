FROM node:21-bullseye-slim

WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD npm start
