FROM node:10

WORKDIR /usr/src/app

COPY package* ./

RUN npm install --only=production

COPY . ./

CMD [ "npm", "start" ]