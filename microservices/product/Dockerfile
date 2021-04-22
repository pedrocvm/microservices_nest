FROM node:12.13-alpine As development

WORKDIR /usr/src/app/product

COPY package*.json ./

RUN npm install

RUN npm rebuild grpc --force

COPY . .

CMD npm run start:dev