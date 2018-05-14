
FROM ubuntu:xenial

LABEL "install-type"="mounted"
ARG SSH_PRIVATE_KEY

RUN echo "deb [arch=amd64] http://repo.sawtooth.me/ubuntu/ci xenial universe" >> /etc/apt/sources.list \
 && echo "deb http://archive.ubuntu.com/ubuntu xenial-backports universe" >> /etc/apt/sources.list \
 && apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 8AA7AF1F1091A5FD \
 && apt-get update \
 && apt-get install -y -q --allow-downgrades \
    build-essential \
    golang-1.9-go \
    git \
    libssl-dev \
    libzmq3-dev \
    openssl \
    python3-grpcio-tools=1.1.3-1 \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

RUN mkdir /root/.ssh/
RUN echo "${SSH_PRIVATE_KEY}" > /root/.ssh/id_rsa

ENV GOPATH=/go
ENV PATH=$PATH:/usr/lib/go-1.9/bin
RUN mkdir -p $GOPATH/src/github.com/BadgeForce/badgeforce-chain-node
WORKDIR $GOPATH/src/github.com/BadgeForce/badgeforce-chain-node
ADD . .
WORKDIR ./credentials/issuer/transaction_processor
RUN go get 
RUN go build -o badgeforce-issuer .
RUN rm /root/.ssh/id_rsa

EXPOSE 4004/tcp

ENTRYPOINT ["./badgeforce-issuer"]