# ---------- Build Stage ----------
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# ---------- Run Stage ----------
FROM node:18-slim

RUN npm install -g serve

WORKDIR /app

# Kopieer de build output
COPY --from=build /app/build ./build

# 🔧 Kopieer je config.json handmatig naar de juiste plek
COPY public/config.json ./build/config.json

EXPOSE 3000

# Start de app via "serve"
CMD ["serve", "-s", "build", "-l", "3000"]
