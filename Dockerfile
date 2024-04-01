FROM node:16

WORKDIR /Users/joeylam/repo/njs/njstool

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "test" ]