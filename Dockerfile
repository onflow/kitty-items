FROM node:12

WORKDIR /app

COPY . .

RUN cd kitty-items-js && npm install && npm run build

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}


CMD ["node", "kitty-items-js/dist/index.js"]