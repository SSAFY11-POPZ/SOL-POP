# Node.js 기반의 Vite 앱 Dockerfile
FROM node:18-alpine as build

WORKDIR /app

# 패키지 파일 복사 및 종속성 설치
COPY package.json package-lock.json ./
RUN npm install

# 애플리케이션 소스 코드 복사 및 빌드
COPY . .
RUN npm run build

# Nginx를 사용하여 빌드된 정적 파일 서빙
FROM nginx:alpine

# Nginx 설정 파일을 복사 (커스터마이징 가능)
COPY nginx.conf /etc/nginx/nginx.conf

# 빌드된 파일을 Nginx 웹 루트로 복사
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
