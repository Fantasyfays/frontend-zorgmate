# Stap 1: build fase
FROM node:18 AS build
WORKDIR /app

# Kopieer alles, incl. .env (zorg dat .dockerignore het NIET uitsluit)
COPY .env.production .env

RUN npm install && npm run build

# Stap 2: server image met Nginx
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
