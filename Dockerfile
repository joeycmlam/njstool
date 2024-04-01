FROM node:16

WORKDIR /Users/joeylam/repo/njs/njstool

COPY package*.json ./
COPY -r database ./

RUN npm install

COPY . .

CMD ["npm", "test"]