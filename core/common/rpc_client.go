package common

import (
	"github.com/rberg2/sawtooth-go-sdk/protobuf/processor_pb2"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"fmt"
)

type MethodHandler interface {
	Handle(*processor_pb2.TpProcessRequest, *processor.Context, interface{}) error
	Method() string
}

type RPCDelegateCB func(request *processor_pb2.TpProcessRequest) (string, interface{}, error)

type RPCClient struct {
	MethodHandlers map[string]MethodHandler
	delegateMethod RPCDelegateCB
}

func (r *RPCClient) registerMethods(handlers ...MethodHandler) *RPCClient {
	for _, handler := range handlers {
		r.MethodHandlers[handler.Method()] = handler
	}
	return r
}

func (r *RPCClient) DelegateMethod(request *processor_pb2.TpProcessRequest, context *processor.Context) error {
	method, payload, err := r.delegateMethod(request)
	if err != nil {
		return err
	}

	if methodHandler, exists := r.MethodHandlers[method]; exists {
		return methodHandler.Handle(request, context, payload)
	}

	return &processor.InvalidTransactionError{Msg: fmt.Sprintf("could not determine RPC method: %v", method)}
}

func NewRPCClient(methodHandlers []MethodHandler, delegateDB RPCDelegateCB) *RPCClient {
	client := &RPCClient{make(map[string]MethodHandler), delegateDB}
	return client.registerMethods(methodHandlers...)
}