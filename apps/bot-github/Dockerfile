FROM node:20-slim AS base
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @aspidasec/bot-github... build

FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/bot-github/dist ./apps/bot-github/dist
COPY --from=build /app/apps/bot-github/package.json ./apps/bot-github/package.json

EXPOSE 3000
CMD ["node", "apps/bot-github/dist/index.js"]
