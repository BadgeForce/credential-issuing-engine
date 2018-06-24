FROM golang:alpine3.7 as builder

RUN apk update && apk add git

ARG LEGO_VERSION=dev
RUN go get -u github.com/xenolf/lego
WORKDIR /go/src/github.com/xenolf/lego
COPY . .
RUN go build -ldflags="-s -X main.version=${LEGO_VERSION}"

FROM alpine:3.7
RUN apk update && apk add --no-cache --virtual ca-certificates
COPY --from=builder /go/src/github.com/xenolf/lego/lego /usr/bin/lego

RUN apk update && apk add openrc --no-cache && apk add apache2 && apk add apache2-utils 
RUN rc-update add apache2
COPY ./proxy.conf /etc/apache2/sites-enabled/000-default.conf
COPY run.sh run.sh 
RUN chmod +x run.sh
RUN sh run.sh
ENTRYPOINT [ "rc-service apache2 start" ]
