FROM node:22-alpine
WORKDIR /app

COPY package*.json ./

# при сборке
RUN npm install

COPY . .

EXPOSE 3000

# при старте контейнера
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]