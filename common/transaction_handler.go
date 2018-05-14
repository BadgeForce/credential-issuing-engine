package common

import (
	"fmt"

	"github.com/BadgeForce/badgeforce-chain-node/credentials/proto/issuer_pb"
	"github.com/gogo/protobuf/proto"
	"github.com/rberg2/sawtooth-go-sdk/logging"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"github.com/rberg2/sawtooth-go-sdk/protobuf/processor_pb2"
)

var logger *logging.Logger = logging.Get()

type SubHandler struct {
	Handle func(request *processor_pb2.TpProcessRequest, context *processor.Context, payload interface{}) error
}

// TransactionHandler ...
type TransactionHandler struct {
	FName       string   `json:"familyName"`
	FVersions   []string `json:"familyVersions"`
	NSpace      []string `json:"nameSpace"`
	SubHandlers map[string]SubHandler
}

// FamilyName ...
func (t *TransactionHandler) FamilyName() string {
	return t.FName
}

// FamilyVersions ...
func (t *TransactionHandler) FamilyVersions() []string {
	return t.FVersions
}

// Namespaces ...
func (t *TransactionHandler) Namespaces() []string {
	return t.NSpace
}

// Apply ...
func (t *TransactionHandler) Apply(request *processor_pb2.TpProcessRequest, context *processor.Context) error {
	err := t.DelegateTransaction(request, context)
	if err != nil {
		return err
	}

	return nil
}

// DelegateTransaction uses the action field on the payload interface to delegate the transaction to the proper subhandler
func (t *TransactionHandler) DelegateTransaction(request *processor_pb2.TpProcessRequest, context *processor.Context) error {
	var err error
	var payload issuer_pb.Payload
	err = proto.Unmarshal(request.GetPayload(), &payload)
	if err != nil {
		logger.Error(err)
		return &processor.InvalidTransactionError{Msg: "Could determine the transaction action from payload"}
	}

	action := payload.GetAction().String()

	logger.Infof("payload %v -----------", action)

	if subHandler, exists := t.SubHandlers[action]; exists {
		err = subHandler.Handle(request, context, &payload)
	} else {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("Invalid action for transaction: %v", action)}
	}

	return err
}

// NewTransactionHandler ...
func NewTransactionHandler(familyName, familyVersions, namespace string, subHandlers map[string]SubHandler) *TransactionHandler {
	return &TransactionHandler{
		FName:       familyName,
		FVersions:   []string{familyVersions},
		NSpace:      []string{namespace},
		SubHandlers: subHandlers,
	}
}
