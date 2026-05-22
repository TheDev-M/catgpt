# ======================================
# 1) Build stage (React)
# ======================================
FROM node:20-alpine AS frontend

WORKDIR /app

COPY ../frontend/package*.json ./
RUN npm ci

COPY ../frontend .

ARG VITE_HF_TOKEN
ARG VITE_RUN_DURATION_MS
ARG VITE_RUN_MIN_INTERVAL_MS
ARG VITE_RUN_MAX_INTERVAL_MS
ARG VITE_FALL_DURATION_MS
ARG VITE_FALL_MIN_INTERVAL_MS
ARG VITE_FALL_MAX_INTERVAL_MS
ARG VITE_HUNGER_INTERVAL_MS

ENV VITE_HF_TOKEN=$VITE_HF_TOKEN
ENV VITE_RUN_DURATION_MS=$VITE_RUN_DURATION_MS
ENV VITE_RUN_MIN_INTERVAL_MS=$VITE_RUN_MIN_INTERVAL_MS
ENV VITE_RUN_MAX_INTERVAL_MS=$VITE_RUN_MAX_INTERVAL_MS
ENV VITE_FALL_DURATION_MS=$VITE_FALL_DURATION_MS
ENV VITE_FALL_MIN_INTERVAL_MS=$VITE_FALL_MIN_INTERVAL_MS
ENV VITE_FALL_MAX_INTERVAL_MS=$VITE_FALL_MAX_INTERVAL_MS
ENV VITE_HUNGER_INTERVAL_MS=$VITE_HUNGER_INTERVAL_MS

RUN npm run build


# ======================================
# 2) Build stage (Maven + JDK)
# ======================================
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml and download dependencies first
COPY pom.xml .
RUN mvn -q dependency:go-offline

# Copy source code
COPY src ./src

# Copy built frontend into Spring Boot's static resources
COPY --from=frontend /app/dist ./src/main/resources/static

# Build the JAR
RUN mvn -q clean package -DskipTests


# ======================================
# 2) Runtime stage (JRE only – smaller)
# ======================================
FROM eclipse-temurin:21-jre

WORKDIR /app

# Copy the built JAR from the previous stage
COPY --from=build /app/target/*.jar app.jar

# Expose backend port
EXPOSE 8080

# Start your Spring Boot app
ENTRYPOINT ["java", "-jar", "app.jar"]
