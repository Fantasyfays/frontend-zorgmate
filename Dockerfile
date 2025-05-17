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
COPY --from=build /app/build ./build

EXPOSE 3000

# ✅ Correcte CMD-regel voor serve
CMD ["serve", "-s", "build", "-l", "3000"]
