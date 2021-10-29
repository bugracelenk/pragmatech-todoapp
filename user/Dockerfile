FROM node:lts-alpine3.11
RUN mkdir -p /var/www/user
WORKDIR /var/www/user
ADD . /var/www/user
RUN yarn install
CMD yarn run build && yarn run start:prod
