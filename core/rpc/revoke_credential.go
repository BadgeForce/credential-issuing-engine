package rpc

import (
	"github.com/rberg2/sawtooth-go-sdk/protobuf/processor_pb2"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"fmt"
	"github.com/BadgeForce/badgeforce-chain-node/core/proto"
	"github.com/BadgeForce/badgeforce-chain-node/core/state"
)

type RevokeCredentialHandler struct {
	method string
}

func (handler *RevokeCredentialHandler) Handle(request *processor_pb2.TpProcessRequest, context *processor.Context, rpcReq interface{}) error  {
	return handler.revokeCredential(request, context, rpcReq.(*badgeforce_pb.RPCRequest))
}

func (handler *RevokeCredentialHandler) Method() string {
	return handler.method
}

func (handler *RevokeCredentialHandler) revokeCredential(request *processor_pb2.TpProcessRequest, context *processor.Context, rpcReq *badgeforce_pb.RPCRequest) error {
	payload, err := NewPayloadDecoder(rpcReq).UnmarshalRevoke()
	if err != nil {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("could not unmarshal payload data from rpc request for ISSUE (%s)", err)}
	}

	return state.NewCredentialState(context).RevokeCredentials(request.GetHeader().GetSignerPublicKey(), payload.Addresses...)
}

var RevokeHandle = &RevokeCredentialHandler{badgeforce_pb.Method_REVOKE.String()}