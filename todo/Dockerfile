FROM node:lts-alpine3.11
RUN mkdir -p /var/www/todo
WORKDIR /var/www/todo
ADD . /var/www/todo
RUN yarn install
CMD yarn run build && yarn run start:prod
