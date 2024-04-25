FROM node:20.12.2-bullseye-slim AS builder

WORKDIR /usr/src/app
COPY ./package.json ./yarn.lock ./
RUN yarn

COPY . ./
RUN yarn build

FROM nginx:1.25.5-alpine
RUN rm /etc/nginx/conf.d/default.conf
COPY ./nginx.conf /etc/nginx/conf.d
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
