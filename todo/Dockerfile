FROM node:lts-alpine3.11
RUN npm install -g yarn
RUN mkdir -p /var/www/todo
WORKDIR /var/www/todo
ADD . /var/www/todo
RUN yarn install
CMD yarn run build && yarn run start:prod