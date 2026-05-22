# ======================================
# 1) Build stage (Maven + JDK)
# ======================================
FROM maven:3.9.6-eclipse-temurin-21 AS build

WORKDIR /app

# Copy pom.xml and download dependencies first
COPY pom.xml .
RUN mvn -q dependency:go-offline

# Copy source code
COPY src ./src

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
