# ---- Build Stage ----
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ---- Production Stage ----
FROM node:20-alpine AS runner
WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache wget curl

# Install PM2 globally for process management
RUN npm install -g pm2

# Copy built artifacts
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/ecosystem.config.cjs ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/docker ./docker

# Install production dependencies only
RUN npm ci --omit=dev

EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=5s --retries=3 --start-period=40s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/v1/health || exit 1

CMD ["pm2-runtime", "start", "ecosystem.config.cjs", "--no-daemon"]
