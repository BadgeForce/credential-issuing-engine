package rpc

import (
	"github.com/BadgeForce/credential-issuing-engine/core/credential_pb"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"github.com/rberg2/sawtooth-go-sdk/protobuf/processor_pb2"
)

// IssueCredentialHandler RPC handler to handle issuing credentials
type IssueCredentialHandler struct {
	method string
}

// Handle ...
func (handler *IssueCredentialHandler) Handle(request *processor_pb2.TpProcessRequest, context *processor.Context, reqData interface{}) error {
	_ := reqData.(credential_pb.Issue)
	//return state.NewTemplateState(context).Save(create.GetParams())
	return nil
}

// Method ...
func (handler *IssueCredentialHandler) Method() string {
	return handler.method
}

// IssueHandle ...
var IssueHandle = &IssueCredentialHandler{credential_pb.Method_ISSUE.String()}
