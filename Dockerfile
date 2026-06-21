# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies (use npm install to resolve platform-native binaries on Linux)
COPY package.json ./
RUN npm install

# Copy source code
COPY . .

# Build frontend (Vite) and backend (esbuild)
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

WORKDIR /app

# Copy package files and install production dependencies only
COPY package.json ./
RUN npm install --omit=dev

# Copy built output from builder
COPY --from=builder /app/dist ./dist

# Cloud Run uses PORT env variable (default 8080)
ENV NODE_ENV=production
ENV PORT=8080

# Expose the port
EXPOSE 8080

# Start the production server
CMD ["node", "dist/server.cjs"]
