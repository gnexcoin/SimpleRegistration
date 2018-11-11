FROM node:carbon
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY bin /app/bin
COPY public /app/public
COPY routes /app/routes
COPY views /app/views
COPY app.js /app
COPY db.js /app
EXPOSE 3000
CMD [ "node", "./bin/www" ]