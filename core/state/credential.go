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
	return fmt.Sprintf(credAddressTmpl, c.Namespace, )
}

func NewCredAddr(credName, recipient string) *CredStateAddr {
	return &CredStateAddr{CredNamespace, utils.Hexdigest(recipient)[:recAddrByteOffSet], utils.Hexdigest(credName)[:credAddrByteOffSet]}
}

func (c *CredStateManager) SaveCredential(credential *badgeforce_pb.Credential, issuance *badgeforce_pb.Issuance) error {
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

// GetStorageHash ...
func (s *AcademicState) GetStorageHash(publicKey, degreeName, institutionID string) (*issuer_pb.StorageHash, error) {
	var storageHash issuer_pb.StorageHash
	address := common.IdentifierAddress(Namespace, publicKey, fmt.Sprintf("%v%v%v", publicKey, degreeName, institutionID))
	AcademicState, err := s.Context.GetState([]string{address})
	if err != nil {
		return nil, &processor.InvalidTransactionError{Msg: "Could not GetAcademicState"}
	}
	if len(AcademicState[address]) > 0 {
		proto.Unmarshal(AcademicState[address], &storageHash)
		return &storageHash, nil
	}

	return nil, &processor.InvalidTransactionError{Msg: "Credential Not Found"}
}

// SaveCredential ...
func (s *AcademicState) SaveCredential(credential issuer_pb.AcademicCredential) (string, error) {
	//ipfsClient := common.NewIPFSHTTPClient(IPFSCONN)
	//hash, err := ipfsClient.AddBACFile(credential)
	//if err != nil {
	//	return "", &processor.InvalidTransactionError{Msg: fmt.Sprintf("Could not save data to IPFS %v", err.Error())}
	//}

	storageHash := issuer_pb.StorageHash{Hash: hash}
	err = s.SaveStorageHash(credential.GetCoreInfo(), storageHash)
	if err != nil {
		return "", &processor.InvalidTransactionError{Msg: fmt.Sprintf("Could not storage hash %v", err.Error())}
	}

	return hash, nil
}

// SaveStorageHash ...
func (s *AcademicState) SaveStorageHash(credential *issuer_pb.Core, storageHash issuer_pb.StorageHash) error {
	//validate this data
	address := common.IdentifierAddress(Namespace, credential.GetRecipient(), fmt.Sprintf("%v%v%v", credential.GetRecipient(), credential.GetName(), credential.GetInstitutionId()))
	b, err := proto.Marshal(&storageHash)
	if err != nil {
		logger.Error(err)
		return &processor.InvalidTransactionError{Msg: "Invalid data format"}
	}
	_, err = s.Context.SetState(map[string][]byte{
		address: b,
	})
	if err != nil {
		logger.Errorf("ERROR", err, address)
		return &processor.InvalidTransactionError{Msg: "Could not set Storage Hash"}
	}

	return nil
}
