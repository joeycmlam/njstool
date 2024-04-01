FROM node:16

WORKDIR /Users/joeylam/repo/njs/njstool

COPY package*.json ./
COPY database ./

RUN npm install

COPY . .

CMD ["npm", "test"]