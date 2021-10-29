FROM node:lts-alpine3.11
RUN mkdir -p /var/www/team
WORKDIR /var/www/team
ADD . /var/www/team
RUN yarn install
CMD yarn run build && yarn run start:prod
