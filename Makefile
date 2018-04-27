ifndef $(GOPATH)
    GOPATH=$(shell go env GOPATH)
    export GOPATH
endif

protobuf : 
	protoc -I ./accounts ./accounts/account/proto/account.proto --go_out=$(GOPATH)/src
	protoc -I ./accounts ./accounts/payload/proto/payload.proto --go_out=$(GOPATH)/src
	protoc -I ./accounts ./accounts/account/proto/account.proto --js_out=import_style=commonjs,binary:./dev-scripts/protos
	protoc -I ./accounts ./accounts/payload/proto/payload.proto --js_out=import_style=commonjs,binary:./dev-scripts/protos