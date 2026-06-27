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

RUN npm install -g wrangler pm2

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/ecosystem.config.cjs ./
COPY --from=builder /app/wrangler.jsonc ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/docker ./docker

RUN npm ci --omit=dev

EXPOSE 3000

CMD ["pm2-runtime", "start", "ecosystem.config.cjs"]

