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
	go get ${PKG}

build:
	go build -i -v -o ${OUT} ${PKG}

test:
	@go test -short ${PKG_LIST}

vet:
	@go vet ${PKG_LIST}

lint:
	@for file in ${GO_FILES} ;  do \
		golint $$file ; \
	done

runtp:
	./${OUT}-v${VERSION} --validator-endpoint $(validator)

out:
	@echo ${OUT}-v${VERSION}

protos:
	protoc -I ${PROTOS} ${PROTOS}/payload.proto ${PROTOS}/credential.proto --go_out=${PROTOS}
	protoc -I ${PROTOS} ${PROTOS}/payload.proto ${PROTOS}/credential.proto --js_out=import_style=commonjs,binary:./proto-js

clean:
	-@rm ${OUT} ${OUT}-v*

.PHONY: run protos runtp build docker-image vet lint out deps