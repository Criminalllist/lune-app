# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

# Rename App.vue -> app.vue for Linux case-sensitive filesystem
RUN mv src/App.vue src/app.vue 2>/dev/null || true

RUN npm run generate

# Production stage
FROM nginx:alpine AS production

COPY --from=builder /app/.output/public /usr/share/nginx/html

# SPA routing: redirect 404s to index.html
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
