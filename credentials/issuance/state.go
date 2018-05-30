package issuance

import (
	"fmt"

	"github.com/BadgeForce/badgeforce-chain-node/common"
	issuer_pb "github.com/BadgeForce/badgeforce-chain-node/credentials/proto/issuer_pb"
	"github.com/gogo/protobuf/proto"
	"github.com/rberg2/sawtooth-go-sdk/logging"
	"github.com/rberg2/sawtooth-go-sdk/processor"
)

var logger = logging.Get()

const prefix = "credentials:issuer:issuance"

// Namespace ...
var Namespace = common.ComputeNamespace(prefix)

// IssuanceState ...
type IssuanceState common.State

// NewIssuanceState ...
func NewIssuanceState(context *processor.Context) *IssuanceState {
	return &IssuanceState{
		Context: context,
	}
}

// GetIssuance ...
func (s *IssuanceState) GetIssuance(signature, issuer string) (*issuer_pb.Issuance, error) {
	var issuance issuer_pb.Issuance
	address := common.IdentifierAddress(Namespace, issuer, fmt.Sprintf("%v%v", signature, issuer))
	state, err := s.Context.GetState([]string{address})
	if err != nil {
		logger.Error(err)
		return nil, &processor.InvalidTransactionError{Msg: "Could not GetIssuanceState"}
	}
	if len(state[address]) > 0 {
		proto.Unmarshal(state[address], &issuance)
		return &issuance, nil
	}

	return nil, &processor.InvalidTransactionError{Msg: "Issuance Not Found"}
}

// SaveIssuance ...
func (s *IssuanceState) SaveIssuance(issuance *issuer_pb.Issuance) error {
	//validate this data
	address := common.IdentifierAddress(Namespace, issuance.GetIssuerPublicKey(), fmt.Sprintf("%v%v", issuance.GetSignature(), issuance.GetIssuerPublicKey()))
	b, err := proto.Marshal(issuance)
	if err != nil {
		logger.Error(err)
		return &processor.InvalidTransactionError{Msg: "Invalid data format"}
	}
	_, err = s.Context.SetState(map[string][]byte{
		address: b,
	})
	if err != nil {
		logger.Errorf("ERROR", err, address)
		return &processor.InvalidTransactionError{Msg: "Here Could not set Issuance"}
	}

	return nil
}

// Revoke ...
func (s *IssuanceState) Revoke(signature, issuer string) error {
	issuance, err := s.GetIssuance(signature, issuer)
	if err != nil {
		return &processor.InvalidTransactionError{Msg: "Could not get issuance"}
	}

	issuance.RevokationStatus = true
	err = s.SaveIssuance(issuance)
	if err != nil {
		return &processor.InvalidTransactionError{Msg: "Could not set Issuance"}
	}

	return nil
}
