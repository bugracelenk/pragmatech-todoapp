FROM node:lts-alpine3.11
RUN npm install -g yarn
RUN mkdir -p /var/www/mail
WORKDIR /var/www/mail
ADD . /var/www/mail
RUN yarn install
CMD yarn run build && yarn run start:prod