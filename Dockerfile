# syntax=docker/dockerfile:1

# Build stage
ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION} AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
ENV NODE_ENV=production
RUN npm run build

# Serve stage
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

ARG BUILD_DIR=dist
COPY --from=build /app/${BUILD_DIR} /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]