FROM node as build

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn

COPY . .

RUN yarn build:prod
RUN yarn test

RUN yarn install --production


# production

FROM node:alpine

WORKDIR /app

COPY --from=build /app .

ENV NODE_ENV=production

EXPOSE 56178

CMD [ "node", "index" ]