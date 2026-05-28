# Giai đoạn 1: Build với Maven và JDK 21
FROM maven:3.9.6-eclipse-temurin-21 AS build
WORKDIR /app

# 1) Copy chỉ pom.xml trước để tận dụng Docker layer cache cho dependencies
COPY pom.xml .

# 2) Tải tất cả dependencies (bao gồm Spring AI Milestones) vào local repo
#    Bước này chỉ chạy lại khi pom.xml thay đổi
RUN mvn dependency:go-offline -B

# 3) Copy source code và build
COPY src ./src
# Build bỏ qua test để tiết kiệm thời gian CI/CD
RUN mvn clean package -DskipTests -B

# Giai đoạn 2: Chạy ứng dụng với JRE 21 mỏng nhẹ (Alpine)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
# Copy file jar từ giai đoạn build
COPY --from=build /app/target/*.jar app.jar

# Port này sẽ được điều phối bởi Docker Compose
ENTRYPOINT ["java", "-jar", "app.jar"]
