# Giai đoạn 1: Build với Maven và JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
COPY src ./src
# Build bỏ qua test để tiết kiệm thời gian CI/CD
RUN mvn clean package -DskipTests

# Giai đoạn 2: Chạy ứng dụng với JRE 21 mỏng nhẹ (Alpine)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copy file jar từ giai đoạn build
COPY --from=build /app/target/*.jar app.jar

# Port này sẽ được điều phối bởi Docker Compose
ENTRYPOINT ["java", "-jar", "app.jar"]