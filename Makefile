network_up:
	docker-compose -f ./compose-network/badgeforce/badgeforce-network.yaml up --force-recreate 

network_down:
	docker-compose -f ./compose-network/badgeforce/badgeforce-network.yaml down 

network_peer: 
	docker-compose -f ./compose-network/peer-node/badgeforce-network-peer.yaml up --force-recreate

network_peer_remove:
	docker-compose -f ./compose-network/peer-node/badgeforce-network-peer.yaml down

docker_build: 
	docker build --build-arg SSH_PRIVATE_KEY=~/.ssh/id_rsa -f credentials/issuer/docker/Dockerfile -t badgeforce-issuer .		
	docker build --build-arg SSH_PRIVATE_KEY=~/.ssh/id_rsa -f accounts/docker/Dockerfile -t badgeforce-accounts .		

compile_protobufers: protobuf_accounts protobuf_credentials

protobuf_accounts :
	protoc -I ./accounts/proto ./accounts/proto/account.proto ./accounts/proto/payload.proto --go_out=./accounts/proto/badgeforce_pb

protobuf_credentials :
	protoc -I ./credentials/proto ./credentials/proto/payload.proto ./credentials/proto/issuance.proto ./credentials/proto/degree.proto  --go_out=./credentials/proto/issuer_pb

compile_protos_browser :
	pbjs -t static-module -w commonjs -o ./protobufs-js/browser/accounts/compiled.js ./accounts/proto/account.proto ./accounts/proto/payload.proto
	pbjs -t static-module -w commonjs -o ./protobufs-js//browser/credentials/compiled.js ./credentials/proto/payload.proto ./credentials/proto/issuance.proto ./credentials/proto/degree.proto

compile_protos_node :
	protoc -I ./credentials/proto ./credentials/proto/payload.proto ./credentials/proto/issuance.proto ./credentials/proto/degree.proto --js_out=import_style=commonjs,binary:./protobufs-js/node/credentials
	protoc -I ./accounts/proto ./accounts/proto/account.proto ./accounts/proto/payload.proto --js_out=import_style=commonjs,binary:./protobufs-js/node/accounts

compile_protos_js : compile_protos_browser compile_protos_node
