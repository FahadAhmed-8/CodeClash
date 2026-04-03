FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install --production

# ---

FROM node:18-alpine

# Security: run as non-root user
RUN addgroup -S codeclash && adduser -S codeclash -G codeclash

WORKDIR /app

# Install compilers and runtimes
RUN apk update && apk add --no-cache \
    g++ \
    openjdk17-jre-headless \
    python3 \
    coreutils \
    && rm -rf /var/cache/apk/*

# Copy node_modules from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy app source
COPY . .

# Create sandboxed directories with correct permissions
RUN mkdir -p /app/codes /app/inputs /app/outputs \
    && chown -R codeclash:codeclash /app

# Set resource limits via env
ENV PORT=8000
ENV NODE_ENV=production

# Healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8000/ || exit 1

EXPOSE 8000

USER codeclash

CMD ["node", "index.js"]
