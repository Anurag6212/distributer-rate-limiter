FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./
RUN pnpm install

COPY src ./src
COPY tsconfig.json ./

RUN pnpm build

# copy lua scripts
COPY src/modules/rateLimiter/lua ./dist/modules/rateLimiter/lua

EXPOSE 3000

CMD ["node", "dist/index.js"]