package issuer

import (
	"fmt"
	"strconv"

	"github.com/BadgeForce/badgeforce-chain-node/common"
	issuer_pb "github.com/BadgeForce/badgeforce-chain-node/credentials/proto/issuer_pb"
	"github.com/gogo/protobuf/proto"
)

// ComputeIntegrityHash ...
func ComputeIntegrityHash(credential *issuer_pb.Core) (string, error) {
	b, _ := proto.Marshal(credential)
	return common.Hexdigest(string(b)), nil
}

// VerifyDates checks date format RFC3339
func VerifyDates(dates ...string) error {
	for _, date := range dates {
		_, err := strconv.ParseInt(date, 10, 64)
		if err != nil {
			return fmt.Errorf("Datetime format invalid: %v", err)
		}
	}

	return nil
}
