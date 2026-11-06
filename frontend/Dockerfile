
# Stage 1: Build the React + Vite application
FROM node:22-alpine AS build

WORKDIR /app

# Copy dependency manifests first for better Docker layer caching
COPY package.json package-lock.json ./

# Install exact dependency versions from package-lock.json
RUN npm ci

# Copy the remaining frontend source code
COPY . .

# Build the production-ready static files
RUN npm run build

# Stage 2: Serve the built application using Nginx
FROM nginx:alpine

# Copy the production build into Nginx's public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Nginx listens on port 80 inside the container
EXPOSE 80

# Keep Nginx running in the foreground
CMD ["nginx", "-g", "daemon off;"]
