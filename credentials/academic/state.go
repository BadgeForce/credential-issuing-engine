package academic

import (
	"bytes"
	"fmt"

	"github.com/BadgeForce/badgeforce-chain-node/common"
	issuer_pb "github.com/BadgeForce/badgeforce-chain-node/credentials/proto/issuer_pb"
	"github.com/gogo/protobuf/proto"
	ipfs "github.com/ipfs/go-ipfs-api"
	"github.com/rberg2/sawtooth-go-sdk/logging"
	"github.com/rberg2/sawtooth-go-sdk/processor"
)

var logger = logging.Get()

const prefix = "credentials:academic"

// Namespace ...
var Namespace = common.ComputeNamespace(prefix)

// AcademicState ...
type AcademicState common.State

// NewAcademicState ...
func NewAcademicState(context *processor.Context) *AcademicState {
	return &AcademicState{
		Context: context,
	}
}

// GetStorageHash ...
func (s *AcademicState) GetStorageHash(publicKey, degreeName, institutionID string) (*issuer_pb.StorageHash, error) {
	var storageHash issuer_pb.StorageHash
	prefix := common.MakeAddress(Namespace, publicKey)
	address := GetACAddress(prefix, degreeName, institutionID)
	AcademicState, err := s.Context.GetState([]string{address})
	if err != nil {
		return nil, &processor.InternalError{Msg: "Could not GetAcademicState"}
	}
	if len(AcademicState[address]) > 0 {
		proto.Unmarshal(AcademicState[address], &storageHash)
		return &storageHash, nil
	}

	return nil, &processor.InternalError{Msg: "Credential Not Found"}
}

// SaveCredential ...
func (s *AcademicState) SaveCredential(credential issuer_pb.Core) error {
	var err error
	var hash string

	shell := ipfs.NewShell("tcp://ipfs-node:5001")

	b, err := proto.Marshal(&credential)
	if err != nil {
		logger.Error(err)
		return &processor.InvalidTransactionError{Msg: "Invalid data format"}
	}
	logger.Debug(len(b))
	reader := bytes.NewReader(b)

	if hash, err = shell.Add(reader); err != nil {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("Could not save storage hash %v", err.Error())}
	}

	logger.Debug(hash)
	storageHash := issuer_pb.StorageHash{Hash: hash}
	err = s.SaveStorageHash(credential, storageHash)

	return err
}

// SaveStorageHash ...
func (s *AcademicState) SaveStorageHash(credential issuer_pb.Core, storageHash issuer_pb.StorageHash) error {
	//validate this data
	address := common.MakeAddress(Namespace, credential.GetRecipient()+credential.GetName()+credential.GetInstitutionId())
	_, err := proto.Marshal(&storageHash)
	if err != nil {
		logger.Error(err)
		return &processor.InvalidTransactionError{Msg: "Invalid data format"}
	}
	_, err = s.Context.SetState(map[string][]byte{
		address: []byte(storageHash.String()),
	})
	if err != nil {
		logger.Errorf("ERROR", err, address)
		return &processor.InternalError{Msg: "Could not set Storage Hash"}
	}

	return nil
}

// GetACAddress . . .
func GetACAddress(prefix, degreeName, institutionID string) string {
	return prefix + common.Hexdigest(degreeName + institutionID)[:64]
}
