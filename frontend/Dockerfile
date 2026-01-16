# ======================================
# 1) Build stage
# ======================================
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build arguments for environment variables
ARG VITE_API_BASE_URL
ARG VITE_HF_TOKEN
ARG VITE_RUN_DURATION_MS
ARG VITE_RUN_MIN_INTERVAL_MS
ARG VITE_RUN_MAX_INTERVAL_MS
ARG VITE_FALL_DURATION_MS
ARG VITE_FALL_MIN_INTERVAL_MS
ARG VITE_FALL_MAX_INTERVAL_MS
ARG VITE_HUNGER_INTERVAL_MS

# Set environment variables for build
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_HF_TOKEN=$VITE_HF_TOKEN
ENV VITE_RUN_DURATION_MS=$VITE_RUN_DURATION_MS
ENV VITE_RUN_MIN_INTERVAL_MS=$VITE_RUN_MIN_INTERVAL_MS
ENV VITE_RUN_MAX_INTERVAL_MS=$VITE_RUN_MAX_INTERVAL_MS
ENV VITE_FALL_DURATION_MS=$VITE_FALL_DURATION_MS
ENV VITE_FALL_MIN_INTERVAL_MS=$VITE_FALL_MIN_INTERVAL_MS
ENV VITE_FALL_MAX_INTERVAL_MS=$VITE_FALL_MAX_INTERVAL_MS
ENV VITE_HUNGER_INTERVAL_MS=$VITE_HUNGER_INTERVAL_MS

# Build the app
RUN npm run build

# ======================================
# 2) Production stage with nginx
# ======================================
FROM nginx:alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
