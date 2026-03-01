# ============================================================
# Stage 1: Build Spring Boot Backend
# ============================================================
FROM eclipse-temurin:17-jdk-alpine AS backend-build
WORKDIR /build

COPY backend/.mvn .mvn
COPY backend/mvnw backend/pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -B

COPY backend/src ./src
RUN ./mvnw package -DskipTests -B

# ============================================================
# Stage 2: Build Next.js Frontend
# ============================================================
FROM node:20-alpine AS frontend-build
WORKDIR /build

COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci

COPY frontend/ ./

ENV NEXT_PUBLIC_API_URL=""
RUN npm run build

# ============================================================
# Stage 3: Production Runtime (nginx + java + node)
# ============================================================
FROM eclipse-temurin:17-jre-alpine AS runtime

# Install nginx and Node.js
RUN apk add --no-cache nginx nodejs

# Copy nginx config
COPY nginx.conf /etc/nginx/nginx.conf

# Copy backend JAR
COPY --from=backend-build /build/target/*.jar /app/backend.jar

# Copy Next.js standalone output
COPY --from=frontend-build /build/.next/standalone /app/frontend
COPY --from=frontend-build /build/.next/static /app/frontend/.next/static
COPY --from=frontend-build /build/public /app/frontend/public

# Copy startup script
COPY start.sh /app/start.sh
RUN chmod +x /app/start.sh

# SQLite database will be stored in /data
RUN mkdir -p /data
WORKDIR /data

EXPOSE 8080

CMD ["/app/start.sh"]
