FROM node:9.2.0
COPY . /app
WORKDIR /app
RUN npm install -g node-gyp
RUN npm install
RUN npm run build
WORKDIR /app/server/
RUN pwd
RUN npm install
EXPOSE 3000
CMD ["npm", "start"]
