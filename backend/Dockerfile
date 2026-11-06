
# Stage 1: Build the Spring Boot application
FROM eclipse-temurin:21-jdk-alpine AS builder

WORKDIR /app

# Copy Maven Wrapper and project configuration
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Build dependencies
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

# Copy source code
COPY src/ ./src/

# Build executable JAR
RUN ./mvnw clean package -DskipTests -B

# Stage 2: Run the application
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Copy executable JAR
COPY --from=builder /app/target/*.jar app.jar

# Render / Spring Boot port
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
