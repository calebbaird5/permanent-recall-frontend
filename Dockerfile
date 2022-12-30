FROM node:lts-alpine

RUN apk update && \
    apk upgrade && \
    apk add git && \
