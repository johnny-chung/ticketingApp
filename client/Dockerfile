FROM node:20-alpine

WORKDIR /app
COPY package.json .
RUN npm install --verbose
COPY . .


CMD ["npm", "run", "dev"]