FROM nginx:stable-alpine
LABEL maintainer="orlancesar880@gmail.com"
RUN apk upgrade --no-cache \
    && rm -rf /usr/share/nginx/html/*
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY src/ /usr/share/nginx/html/
USER nginx
EXPOSE 8080
HEALTHCHECK CMD wget -qO- http://localhost:8080/ || exit 1
