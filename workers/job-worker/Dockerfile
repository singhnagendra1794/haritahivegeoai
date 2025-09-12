FROM node:18-alpine

WORKDIR /app

# Install system dependencies for GDAL
RUN apk add --no-cache \
    gdal-dev \
    gdal-tools \
    python3 \
    make \
    g++

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY src/ ./src/
COPY tsconfig.json ./

# Build TypeScript
RUN npm run build

# Create logs directory
RUN mkdir -p logs

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${HEALTH_CHECK_PORT:-3001}/health || exit 1

EXPOSE 3001

USER node

CMD ["npm", "start"]