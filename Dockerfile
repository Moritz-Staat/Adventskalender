FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
# scripts/manage.mjs läuft außerhalb von Next und braucht das Modul unter dem normalen Pfad.
RUN cp -rL node_modules/better-sqlite3 .next/standalone/node_modules/better-sqlite3

FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0 DATA_DIR=/data
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/scripts/manage.mjs ./scripts/manage.mjs
COPY --from=build /app/lib/server/core.mjs ./lib/server/core.mjs
RUN mkdir /data && chown node:node /data
USER node
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s \
  CMD node -e "fetch('http://127.0.0.1:3000/api/health').then(r=>process.exit(r.ok?0:1),()=>process.exit(1))"
CMD ["node", "server.js"]
