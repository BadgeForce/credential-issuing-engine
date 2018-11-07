package common

import (
	"github.com/rberg2/sawtooth-go-sdk/protobuf/processor_pb2"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"syscall"
)

type MethodDelegate interface {
	DelegateMethod(*processor_pb2.TpProcessRequest, *processor.Context) error
}

// TransactionHandler ...
type TransactionHandler struct {
	FName          string   `json:"familyName"`
	FVersions      []string `json:"familyVersions"`
	MethodDelegate MethodDelegate
	NamespaceMngr  *NamespaceMngr
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
	return t.NamespaceMngr.NameSpaces
}

// Apply ...
func (t *TransactionHandler) Apply(request *processor_pb2.TpProcessRequest, context *processor.Context) error {
	return t.MethodDelegate.DelegateMethod(request, context)
}

// NewTransactionHandler returns a new transaction handler
func NewTransactionHandler(methodDelegate MethodDelegate, fname string, fversions, namespaces []string) *TransactionHandler {
	return &TransactionHandler{
		FName:          fname,
		FVersions:      fversions,
		MethodDelegate: methodDelegate,
		NamespaceMngr: NewNamespaceMngr().RegisterNamespaces(namespaces...),
	}
}

func NewTransactionProcessor(validator string, handler processor.TransactionHandler) *processor.TransactionProcessor {
	processor := processor.NewTransactionProcessor(validator)
	processor.AddHandler(handler)
	processor.ShutdownOnSignal(syscall.SIGINT, syscall.SIGTERM)
	return processor
}
