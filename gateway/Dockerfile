FROM node:lts-alpine3.11
RUN npm install -g yarn
RUN mkdir -p /var/www/gateway
WORKDIR /var/www/gateway
ADD . /var/www/gateway
RUN yarn install
CMD yarn run build && yarn run start:prod