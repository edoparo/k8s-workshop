FROM node:latest

WORKDIR /usr/src/app


COPY package.json .
COPY index.js .
RUN npm install --loglevel notice

EXPOSE 3000

CMD [ "npm", "run", "start" ]
