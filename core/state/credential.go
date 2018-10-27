package state

import (
	"fmt"
	"github.com/gogo/protobuf/proto"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"github.com/BadgeForce/badgeforce-chain-node/core/utils"
	"github.com/BadgeForce/badgeforce-chain-node/core/protos"
	"encoding/json"
)

const (
	credStatePrefix = "credentials"

	// {credentials}:{recipient publickey}:{credential name}
	credAddressTmpl = "%s:%s:%s"

	recAddrByteOffSet  = 32
	credAddrByteOffSet = 32
)

// Namespace ...
var CredNamespace = utils.NamespacePrefixStr(credStatePrefix)

// CredStateManager ...
type CredStateManager State

type CredStateAddr struct {
	Namespace string
	RecipientHex string
	CredentialNameHex string
}

func (c *CredStateAddr) String() string {
	return fmt.Sprintf(credAddressTmpl, c.Namespace, c.RecipientHex, c.CredentialNameHex)
}

func NewCredAddr(credName, recipient string) *CredStateAddr {
	return &CredStateAddr{CredNamespace, utils.Hexdigest(recipient)[:recAddrByteOffSet], utils.Hexdigest(credName)[:credAddrByteOffSet]}
}

func (c *CredStateManager) SaveCredential(credential *badgeforce_pb.Credential, issuance *badgeforce_pb.Issuance) error {
	//ipfsClient := common.NewIPFSHTTPClient(IPFSCONN)
	//hash, err := ipfsClient.AddBACFile(credential)
	//if err != nil {
	//	return "", &processor.InvalidTransactionError{Msg: fmt.Sprintf("Could not save data to IPFS %v", err.Error())}
	//}

	address := NewCredAddr(credential.GetTemplateName(), issuance.GetTemplateName())
	b, err := proto.Marshal(credential)
	if err != nil {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("unable to marshal credential proto data (%s)", err)}
	}

	_, err = c.Context.SetState(map[string][]{address.String(): b})
	if err != nil {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("unable to save credential (%s)", err)}
	}

	return nil
}

func (c *CredStateManager) GetCredentials(address ...string) ([]badgeforce_pb.Credential, error) {
	state, err := c.Context.GetState(address)
	if err != nil {
		return nil, &processor.InvalidTransactionError{Msg: fmt.Sprintf("could not get state (%s)", err)}
	}

	credentials := make([]badgeforce_pb.Credential, 0)
	for _, credential := range state {
		var cred badgeforce_pb.Credential
		err := proto.Unmarshal(credential, &cred)
		if err != nil {
			return nil, &processor.InvalidTransactionError{Msg: fmt.Sprintf("could not unmarshal json data (%s)", err)}
		}
		credentials = append(credentials, cred)
	}

	return credentials, nil
}

func (c *CredStateManager) DeleteTemplates(addresses ...string) error {
	_, err := c.Context.DeleteState(addresses)
	if err != nil {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("unable to delete credential(s) (%s)", err)}
	}

	//for _, address := range addresses {
	//	_, receiptBytes, err := c.NewTemplateDeleteReceipt("", "", address)
	//	if err != nil {
	//		logger.Warnf("unable to generate transaction receipt for template saved (%s)", err)
	//	}
	//
	//	err = s.context.AddReceiptData(receiptBytes)
	//	if err != nil {
	//		logger.Warnf("unable to add transaction receipt for template saved (%s)", err)
	//	}
	//
	//}

	return nil
}
