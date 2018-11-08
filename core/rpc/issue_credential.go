package rpc

import (
	"github.com/rberg2/sawtooth-go-sdk/protobuf/processor_pb2"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"fmt"
	"github.com/BadgeForce/badgeforce-chain-node/core/proto"
	"github.com/BadgeForce/badgeforce-chain-node/core/state"
	"github.com/gogo/protobuf/proto"
	"github.com/BadgeForce/badgeforce-chain-node/core/common"
)

type IssueCredentialHandler struct {
	method string
}

func (handler *IssueCredentialHandler) Handle(request *processor_pb2.TpProcessRequest, context *processor.Context, rpcReq interface{}) error  {
	return handler.issueCredential(request, context, rpcReq.(*badgeforce_pb.RPCRequest))
}

func (handler *IssueCredentialHandler) Method() string {
	return handler.method
}

func (handler *IssueCredentialHandler) issueCredential(request *processor_pb2.TpProcessRequest, context *processor.Context, rpcReq *badgeforce_pb.RPCRequest) error {
	payload, err := NewPayloadDecoder(rpcReq).UnmarshalIssue()
	if err != nil {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("could not unmarshal payload data from rpc request for ISSUE (%s)", err)}
	}

	decodedPB, err := common.FromHex(payload.CredentialPB)
	if err != nil {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("could not unmarshal credential data from rpc request for ISSUE (%s)", err)}
	}


	var credential badgeforce_pb.Credential
	err = proto.Unmarshal(decodedPB, &credential)
	if err != nil {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("could not unmarshal credential data from rpc request for ISSUE (%s)", err)}
	}

	return state.NewCredentialState(context).SaveCredential(&credential, payload.CredentialData, request.GetHeader().GetSignerPublicKey())
}

var IssueHandle = &IssueCredentialHandler{badgeforce_pb.Method_ISSUE.String()}
