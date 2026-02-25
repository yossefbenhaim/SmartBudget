# syntax=docker/dockerfile:1

# Build stage
ARG NODE_VERSION=20-alpine
FROM node:${NODE_VERSION} AS build
WORKDIR /app

# Accept VITE_ build args — passed by Coolify at build time
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_API_URL
ARG VITE_APP_URL

# Make them available as env vars during `npm run build`
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_URL=$VITE_APP_URL

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
