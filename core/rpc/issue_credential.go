package rpc

import (
	credential_pb "github.com/BadgeForce/credential-issuing-engine/core/credential_pb"
	"github.com/BadgeForce/credential-issuing-engine/core/state"
	"github.com/BadgeForce/credential-issuing-engine/core/verifier"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"github.com/rberg2/sawtooth-go-sdk/protobuf/processor_pb2"
)

// IssueCredentialHandler RPC handler to handle issuing credentials
type IssueCredentialHandler struct {
	method string
}

// Handle ...
func (handler *IssueCredentialHandler) Handle(request *processor_pb2.TpProcessRequest, context *processor.Context, reqData interface{}) error {
	issue := reqData.(credential_pb.Issue)
	credential := issue.GetParams()

	if err := verifier.VerifyCredential(request.GetHeader().GetSignerPublicKey(), credential); err != nil {
		return &processor.InvalidTransactionError{Msg: err.Error()}
	}

	return state.NewCredentialState(context).Save(credential)
}

// Method ...
func (handler *IssueCredentialHandler) Method() string {
	return handler.method
}

// IssueHandle ...
var IssueHandle = &IssueCredentialHandler{credential_pb.CredentialIssuingMethod_ISSUE.String()}
