FROM node:18
ENV TZ=America/Chicago

WORKDIR /app

COPY package*.json ./

RUN npm config set registry http://registry.npmjs.org/

RUN npm install

COPY . .
RUN npm run build

CMD ["node", "./dist/bundle.js"]