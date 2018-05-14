package issuer

import (
	"fmt"

	"github.com/BadgeForce/badgeforce-chain-node/common"
	issuer_pb "github.com/BadgeForce/badgeforce-chain-node/credentials/proto/issuer_pb"
)

// ComputeIntegrityHash ...
func ComputeIntegrityHash(credential *issuer_pb.Core) (string, error) {
	strToHash := fmt.Sprintf("%v%v%v%v%v%v%v%v", credential.GetDateEarned(), credential.GetExpiration().GetSeconds(),
		credential.GetInstitutionId(), credential.GetIssuer(),
		credential.GetName(), credential.GetRecipient(),
		credential.GetSchool(), credential.GetSignature())

	return common.Hexdigest(strToHash), nil
}
