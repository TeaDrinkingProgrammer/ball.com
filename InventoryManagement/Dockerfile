FROM node:lts-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install --only=development

COPY . .

CMD ["yarn", "run", "start:dev"]

FROM node:lts-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}