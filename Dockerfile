FROM node:22.14 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
RUN npm install -g @angular/cli@17.2.0
COPY . .
RUN ng build

FROM nginx:latest
COPY --from=build app/dist/pdv/browser /usr/share/nginx/html
EXPOSE 80 