FROM node:latest

WORKDIR /usr/src/app


COPY package.json .
COPY package-lock.json .
RUN mkdir conf
COPY index.js .
RUN npm install --loglevel notice

EXPOSE 3000

CMD [ "npm", "run", "start" ]
