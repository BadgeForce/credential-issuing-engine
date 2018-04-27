package common

import (
	"github.com/BadgeForce/badgeforce-chain-node/accounts/payload"
	"github.com/rberg2/sawtooth-go-sdk/logging"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"github.com/rberg2/sawtooth-go-sdk/protobuf/processor_pb2"
)

var logger *logging.Logger = logging.Get()

type SubHandler struct {
	Handle func(request *processor_pb2.TpProcessRequest, context *processor.Context, payload *payload.PayloadHandler) error
}
type SubHandlerDelegate struct {
	GetSubHandler func(request *processor_pb2.TpProcessRequest, subHandlers map[string]SubHandler) (SubHandler, *payload.PayloadHandler, error)
}

// TransactionHandler ...
type TransactionHandler struct {
	FName       string   `json:"familyName"`
	FVersions   []string `json:"familyVersions"`
	NSpace      []string `json:"nameSpace"`
	SubHandlers map[string]SubHandler
	SubHandlerDelegate
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
	subHandler, payload, err := t.SubHandlerDelegate.GetSubHandler(request, t.SubHandlers)
	if err != nil {
		return err
	}

	return subHandler.Handle(request, context, payload)
}

// NewTransactionHandler ...
func NewTransactionHandler(familyName, familyVersions, namespace string, subHandlerDelegate SubHandlerDelegate, subHandlers map[string]SubHandler) *TransactionHandler {
	return &TransactionHandler{
		FName:              familyName,
		FVersions:          []string{familyVersions},
		NSpace:             []string{namespace},
		SubHandlerDelegate: subHandlerDelegate,
		SubHandlers:        subHandlers,
	}
}
