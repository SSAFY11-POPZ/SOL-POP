# OpenJDK 기반의 Spring Boot 앱 Dockerfile
FROM openjdk:17

WORKDIR /app

COPY target/*.jar app.jar

ENTRYPOINT ["java", "-jar", "app.jar"]

