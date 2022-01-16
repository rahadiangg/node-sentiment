# pull image
FROM node:lts-alpine3.14

# install dumb-init
RUN apk add dumb-init

# set working directory
WORKDIR /usr/src/app

# copy package.json & package-lock.json for install modules
COPY package*.json ./

# install model only production
# RUN npm install --only=production
RUN npm install

# copy & change owner non root user
# COPY --chown=node:node . .

# set env
ENV NODE_ENV development

EXPOSE 8080

CMD [ "dumb-init", "npm", "start" ]