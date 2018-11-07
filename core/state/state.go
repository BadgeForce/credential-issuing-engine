package state

import (
	"github.com/rberg2/sawtooth-go-sdk/logging"
	"github.com/BadgeForce/badgeforce-chain-node/core/common"
	"github.com/BadgeForce/badgeforce-chain-node/core/proto"
)

// @Todo move VerifiableCredentialPrefix to configuration
// VerifiableCredentialPrefix ...
const VerifiableCredentialPrefix = "credential:verifiable:credential"

var (
	logger = logging.Get()
	NameSpaceMngr *common.NamespaceMngr
)

func CredentialAddress(credential *badgeforce_pb.Credential) string {
	recipient := common.NewPart(credential.GetRecipientPublicKey(), 0, 25)
	issuer := common.NewPart(credential.GetIssuerPublicKey(), 0, 25)
	name := common.NewPart(credential.GetName(), 0, 14)

	addressParts := []*common.AddressPart{recipient, issuer, name}
	address, _ := common.NewAddress(NameSpaceMngr.NameSpaces[0]).AddParts(addressParts...).Build()
	return address
}

func init()  {
	NameSpaceMngr = common.NewNamespaceMngr().RegisterNamespaces(VerifiableCredentialPrefix)
}