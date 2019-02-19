package rpc

import (
	"github.com/BadgeForce/credential-issuing-engine/core/credential_pb"
	"github.com/BadgeForce/sawtooth-utils"
	"github.com/golang/protobuf/proto"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"github.com/rberg2/sawtooth-go-sdk/protobuf/processor_pb2"
)

// Client ...
var Client *utils.RPCClient

var delegateCB = func(request *processor_pb2.TpProcessRequest) (string, interface{}, error) {
	var rpcRequest credential_pb.RPCRequest
	err := proto.Unmarshal(request.GetPayload(), &rpcRequest)
	if err != nil {
		return "", nil, &processor.InvalidTransactionError{Msg: "unable to unmarshal RPC request"}
	}

	switch method := rpcRequest.Method.(type) {
	case *credential_pb.RPCRequest_Issue:
		return credential_pb.Method_ISSUE.String(), method.Issue, nil
	case *credential_pb.RPCRequest_Revoke:
		return credential_pb.Method_REVOKE.String(), method.Revoke, nil
	default:
		return "", nil, &processor.InvalidTransactionError{Msg: "invalid RPC method"}
	}
}

func init() {
	handlers := []utils.MethodHandler{IssueHandle, RevokeHandle}
	Client = utils.NewRPCClient(handlers, delegateCB)
}
