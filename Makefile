ifndef $(GOPATH)
    GOPATH=$(shell go env GOPATH)
    export GOPATH
endif

network_up:
	docker-compose -f ./compose-network/badgeforce/badgeforce-network.yaml up --force-recreate 

network_down:
	docker-compose -f ./compose-network/badgeforce/badgeforce-network.yaml down 

network_peer: 
	docker-compose -f ./compose-network/peer-node/badgeforce-network-peer.yaml up --force-recreate

network_peer_remove:
	docker-compose -f ./compose-network/peer-node/badgeforce-network-peer.yaml down

compile_protobufers: protobuf_accounts protobuf_credentials

protobuf_accounts :
	protoc -I ./accounts/proto ./accounts/proto/account.proto ./accounts/proto/payload.proto --go_out=./accounts/proto/badgeforce_pb
	protoc -I ./accounts/proto ./accounts/proto/account.proto ./accounts/proto/payload.proto --js_out=import_style=commonjs,binary:./frontend-scripts/protos/node/accounts
	pbjs -t static-module -w commonjs -o ./frontend-scripts/protos/browser/accounts/compiled.js ./accounts/proto/account.proto ./accounts/proto/payload.proto



protobuf_credentials :
	protoc -I ./credentials/proto ./credentials/proto/payload.proto ./credentials/proto/issuance.proto ./credentials/proto/degree.proto  --go_out=./credentials/proto/issuer_pb
	protoc -I ./credentials/proto ./credentials/proto/payload.proto ./credentials/proto/issuance.proto ./credentials/proto/degree.proto --js_out=import_style=commonjs,binary:./frontend-scripts/protos/node/credentials
	pbjs -t static-module -w commonjs -o ./frontend-scripts/protos/browser/credentials/compiled.js ./credentials/proto/payload.proto ./credentials/proto/issuance.proto ./credentials/proto/degree.proto
	
