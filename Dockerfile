# Build stage
FROM node:18-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL

RUN npm run build

# Production stage
FROM node:18-alpine
WORKDIR /app

# Installeer http-server globally
RUN npm install -g http-server

COPY --from=build /app/build ./build

EXPOSE 3000

CMD ["http-server", "build", "-p", "3000", "-a", "0.0.0.0"]
