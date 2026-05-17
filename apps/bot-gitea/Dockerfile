FROM node:20-slim AS base
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @aspidasec/bot-gitea... build

FROM base AS runtime
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages ./packages
COPY --from=build /app/apps/bot-gitea/dist ./apps/bot-gitea/dist
COPY --from=build /app/apps/bot-gitea/package.json ./apps/bot-gitea/package.json

EXPOSE 3000
CMD ["node", "apps/bot-gitea/dist/index.js"]
