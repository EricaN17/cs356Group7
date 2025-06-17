FROM node:18

RUN npm install

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200

CMD ["ng", "serve", "--disable-host-check", "--host", "0.0.0.0"]