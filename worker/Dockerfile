FROM node:18-alpine

WORKDIR /app

COPY package.json package.json
RUN npm install
RUN node -e "require('zod'); console.log('zod OK')"
COPY . .

CMD ["node", "app.js"]