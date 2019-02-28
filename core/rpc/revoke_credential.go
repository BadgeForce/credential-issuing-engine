package rpc

import (
	"fmt"
	credential_pb "github.com/BadgeForce/credential-issuing-engine/core/credential_pb"
	"github.com/BadgeForce/credential-issuing-engine/core/state"
	"github.com/BadgeForce/credential-issuing-engine/core/verifier"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"github.com/rberg2/sawtooth-go-sdk/protobuf/processor_pb2"
)

// RevokeCredentialHandler RPC handler to handle revoking credentials
type RevokeCredentialHandler struct {
	method string
}

// Handle ...
func (handler *RevokeCredentialHandler) Handle(request *processor_pb2.TpProcessRequest, context *processor.Context, reqData interface{}) error {
	revoke := reqData.(credential_pb.Revoke)
	addresses := revoke.GetAddresses()

	if invalid, ok := verifier.HasValidOwnership(request.GetHeader().GetSignerPublicKey(), addresses...); !ok {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("invalid issuership of credentials (%s)", invalid)}
	}

	return state.NewCredentialState(context).Revoke(addresses...)
}

// Method ...
func (handler *RevokeCredentialHandler) Method() string {
	return handler.method
}

// RevokeHandle ...
var RevokeHandle = &RevokeCredentialHandler{credential_pb.CredentialIssuingMethod_REVOKE.String()}
