FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
ENV PORT=8000
ENV FRONTEND_URL=http://localhost:5173

RUN npm install

RUN apk update && apk add --no-cache \
    g++ \
    openjdk17 \
    python3 \
    py3-pip \
    coreutils

COPY . .

EXPOSE 8000

CMD ["node", "index.js"]
