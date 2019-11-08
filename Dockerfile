FROM node:dubnium
WORKDIR /app
EXPOSE 80
EXPOSE 3000
COPY package.json /app
RUN npm install
COPY . /app
CMD ["npm", "start"]
