FROM node:12

WORKDIR /app

COPY . .

RUN cd api && npm install && npm run build

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

CMD ["node", "api/dist/index.js"]
