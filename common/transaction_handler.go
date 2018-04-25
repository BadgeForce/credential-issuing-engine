package common

import (
	"github.com/rberg2/sawtooth-go-sdk/logging"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"github.com/rberg2/sawtooth-go-sdk/protobuf/processor_pb2"
)

var logger *logging.Logger = logging.Get()

// TransactionHandler ...
type TransactionHandler struct {
	FName     string   `json:"familyName"`
	FVersions []string `json:"familyVersions"`
	NSpace    []string `json:"nameSpace"`
	ActionMap map[string]func(request *processor_pb2.TpProcessRequest, context *processor.Context) error
	GetAction func(request *processor_pb2.TpProcessRequest) (func(request *processor_pb2.TpProcessRequest, context *processor.Context) error, error)
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
	fn, err := t.GetAction(request)
	if err != nil {
		return err
	}
	return fn(request, context)
}

// NewTransactionHandler ...
func NewTransactionHandler(familyName, familyVersions, namespace string, actionMap map[string]func(request *processor_pb2.TpProcessRequest, context *processor.Context) error) *TransactionHandler {
	return &TransactionHandler{
		FName:     familyName,
		FVersions: []string{familyVersions},
		NSpace:    []string{namespace},
		ActionMap: actionMap,
	}
}
