OUT := credential-template-engine
PKG := github.com/BadgeForce/badgeforce-chain-node/cmd
DOCKERFILE := ./build/package/Dockerfile
VERSION := $(shell git describe --always --long --dirty)
PKG_LIST := $(shell go list ${PKG}/... | grep -v /vendor/)
GO_FILES := $(shell find . -name '*.go' | grep -v /vendor/)
PROTOS := ./core/protos

all: run

docker-image:
	docker build -f ${DOCKERFILE} -t ${OUT} .

deps:
	GO111MODULE=off go get ${PKG}

build:
	GO111MODULE=off go build -i -v -o ${OUT} ${PKG}

test:
	GO111MODULE=off @go test -short ${PKG_LIST}

vet:
	GO111MODULE=off @go vet ${PKG_LIST}

lint:
	@for file in ${GO_FILES} ;  do \
		golint $$file ; \
	done

runtp:
	./${OUT}-v${VERSION} --validator-endpoint $(validator)

out:
	@echo ${OUT}-v${VERSION}

protos:
	protoc -I ./protos ./protos/payload.proto ./protos/credentials.proto --go_out=./core/proto
	protoc -I ./protos ./protos/payload.proto ./protos/credentials.proto --js_out=import_style=commonjs,binary:./dev-cli/proto

clean:
	-@rm ${OUT} ${OUT}-v*

.PHONY: run protos runtp build docker-image vet lint out deps