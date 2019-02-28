package verifier

import (
	"fmt"
	credential_pb "github.com/BadgeForce/credential-issuing-engine/core/credential_pb"
	"github.com/BadgeForce/sawtooth-utils"
	"github.com/golang/protobuf/proto"
	"time"
)

// VerifyCredential ...
func VerifyCredential(txtSignerPub string, credential *credential_pb.Credential) error {
	expiration := credential.GetVerification().GetExpiration().GetSeconds()
	revocationStatus := credential.GetVerification().GetRevocationStatus()

	if expiration != 0 && expiration < time.Now().Unix() {
		return fmt.Errorf("error: credential expired at (%v)", expiration)
	} else if revocationStatus.GetIsRevoked() {
		return fmt.Errorf("error: credential is revoked, date revoked at (%v)", revocationStatus.GetRevokedAt())
	}

	b, err := proto.Marshal(credential.GetData())
	if err != nil {
		return fmt.Errorf("error: could not marshal proto (%s)", err)
	}

	expectedHash := credential.GetVerification().GetProofOfIntegrityHash()
	if hash, ok := utils.VerifyPOIHash(b, expectedHash); !ok {
		return fmt.Errorf("error: proof of integrity hash invalid got (%s) want (%s)", hash, expectedHash)
	}

	issuerPub := credential.GetVerification().GetIssuerPub()
	sig := credential.GetVerification().GetSignature()

	if ok := utils.VerifySig(sig, []byte(txtSignerPub), b, false); !ok {
		return fmt.Errorf("error: transaction signer must also be issuer of the credential (%s)", txtSignerPub)
	} else if txtSignerPub != issuerPub {
		return fmt.Errorf("error: transaction signer public key must match issuer got (%s) want (%s)", issuerPub, txtSignerPub)
	}

	return nil
}

// HasValidOwnership using the first 30 bytes of a public key this func will
// verify that the pub key is the first 30 bytes of each address indicating ownership.
// If validation for one address fails, the entire validation process is will fail, array of address
// that failed validation is returned along with a bool
func HasValidOwnership(issuerPub string, addresses ...string) ([]string, bool) {
	invalid := make([]string, 0)
	prefix := issuerPub[0:30]
	for _, address := range addresses {
		if address[6:30] != prefix {
			invalid = append(invalid, address)
		}
	}

	return invalid, len(invalid) == 0
}