# Stage 1: Base image
FROM node:18.20.8 as base

# Stage 2: Install dependencies
FROM base AS deps
WORKDIR /app
# Install build tools for native modules (e.g., bcrypt)
RUN apt-get update && apt-get install -y build-essential python3
COPY package.json package-lock.json ./
RUN npm ci

# Stage 3: Build the app
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Stage 4: Run the app
FROM base AS runner
WORKDIR /app
# Install build tools for rebuilding bcrypt
RUN apt-get update && apt-get install -y build-essential python3 curl
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
COPY --from=builder --chown=nodejs:nodejs /app/build ./build
COPY --from=builder --chown=nodejs:nodejs /app/package.json /app/package-lock.json ./
# Reinstall dependencies in the runner stage
RUN npm ci
# Debug: Check if finalhandler is installed
RUN ls -la /app/node_modules/finalhandler || echo "finalhandler not found"
# Copy .env if it exists, but don’t fail if it’s missing
COPY --from=builder --chown=nodejs:nodejs /app/.env* ./
USER nodejs
# Set the port to match APP_PORT
ENV PORT 3000
# Add a healthcheck (assumes a health endpoint exists)
HEALTHCHECK --interval=30s --timeout=3s \
	CMD curl -f http://localhost:$PORT/ || exit 1
CMD ["node", "build/index.js"]