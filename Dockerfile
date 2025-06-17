FROM node:18 AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200
EXPOSE 80
CMD ["ng", "serve", "--disable-host-check", "--host", "0.0.0.0"]