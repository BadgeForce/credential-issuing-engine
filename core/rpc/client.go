package rpc

import (
	"github.com/rberg2/sawtooth-go-sdk/protobuf/processor_pb2"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"github.com/golang/protobuf/proto"
	"github.com/BadgeForce/badgeforce-chain-node/core/common"
	"github.com/BadgeForce/badgeforce-chain-node/core/proto"
)

var delegateCB = func(request *processor_pb2.TpProcessRequest) (string, interface{}, error) {
	var rpcRequest badgeforce_pb.RPCRequest
	err := proto.Unmarshal(request.GetPayload(), &rpcRequest)
	if err != nil {
		return "", nil, &processor.InvalidTransactionError{Msg: "malformed payload data"}
	}

	return rpcRequest.GetMethod().String(), &rpcRequest, nil
}

func NewClient() *common.RPCClient {
	handlers := []common.MethodHandler{IssueHandle, RevokeHandle}
	return common.NewRPCClient(handlers, delegateCB)
}
