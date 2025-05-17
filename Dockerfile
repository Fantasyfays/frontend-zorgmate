# Build stage
FROM node:18 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Production stage
FROM node:18

# Install 'serve' globally
RUN npm install -g serve

WORKDIR /app

# Copy the build folder from the previous stage
COPY --from=build /app/build ./build

# Expose the port that serve uses
EXPOSE 3000

# Run the app using 'serve'
CMD ["serve", "-s", "build", "-l", "3000"]
