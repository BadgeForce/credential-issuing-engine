ifndef $(GOPATH)
    GOPATH=$(shell go env GOPATH)
    export GOPATH
endif

protobuf_accounts :
	protoc -I ./accounts/proto ./accounts/proto/account.proto ./accounts/proto/payload.proto --go_out=./accounts/proto/badgeforce_pb
	protoc -I ./accounts/proto ./accounts/proto/account.proto ./accounts/proto/payload.proto --js_out=import_style=commonjs,binary:./dev-scripts/protos

protobuf_credentials :
	protoc -I ./credentials/proto ./credentials/proto/common.proto ./credentials/proto/payload.proto ./credentials/proto/issuance.proto ./credentials/proto/degree.proto  --go_out=./credentials/proto/issuer_pb
	protoc -I ./credentials/proto ./credentials/proto/common.proto ./credentials/proto/issuance.proto ./credentials/proto/degree.proto --js_out=import_style=commonjs,binary:./dev-scripts/protos