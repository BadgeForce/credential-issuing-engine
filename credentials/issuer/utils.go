package issuer

import (
	"github.com/BadgeForce/badgeforce-chain-node/common"
	issuer_pb "github.com/BadgeForce/badgeforce-chain-node/credentials/proto/issuer_pb"
	"github.com/gogo/protobuf/proto"
)

// ComputeIntegrityHash ...
func ComputeIntegrityHash(credential *issuer_pb.Core) (string, error) {
	b, err := proto.Marshal(credential)
	if err != nil {
		return "", err
	}

	return common.Hexdigest(string(b)), nil
}
