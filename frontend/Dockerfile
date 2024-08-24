# Node.js 기반의 React 앱 Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "start"]
