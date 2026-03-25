FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

RUN apk update && apk add --no-cache \
    g++ \
    openjdk17 \
    python3 \
    py3-pip \
    coreutils

# Create directories for code files and outputs
RUN mkdir -p /app/codes /app/inputs /app/outputs

COPY . .

ENV PORT=8000

EXPOSE 8000

CMD ["node", "index.js"]
