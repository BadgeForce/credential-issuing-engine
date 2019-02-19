package rpc

import (
	"github.com/BadgeForce/credential-issuing-engine/core/credential_pb"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"github.com/rberg2/sawtooth-go-sdk/protobuf/processor_pb2"
)

// RevokeCredentialHandler RPC handler to handle revoking credentials
type RevokeCredentialHandler struct {
	method string
}

// Handle ...
func (handler *RevokeCredentialHandler) Handle(request *processor_pb2.TpProcessRequest, context *processor.Context, reqData interface{}) error {
	_ := reqData.(credential_pb.Revoke)
	//return state.NewTemplateState(context).Save(create.GetParams())
	return nil
}

// Method ...
func (handler *RevokeCredentialHandler) Method() string {
	return handler.method
}

// RevokeHandle ...
var RevokeHandle = &RevokeCredentialHandler{credential_pb.Method_REVOKE.String()}
