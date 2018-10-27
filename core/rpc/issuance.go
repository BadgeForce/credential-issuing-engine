package rpc

import (
	"github.com/rberg2/sawtooth-go-sdk/protobuf/processor_pb2"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"github.com/BadgeForce/credential-template-engine/core/state"
	"github.com/BadgeForce/credential-template-engine/core/proto"
	"encoding/json"
	"fmt"
)

var IssuanceHandlers []*MethodHandler

//@Todo implement createIssuance
var createIssuance = func(request *processor_pb2.TpProcessRequest, context *processor.Context, rpcReq *credential_template_engine_pb.RPCRequest) error {
	var templateData state.IssuanceTemplate
	err := json.Unmarshal([]byte(rpcReq.Params), &templateData)
	if err != nil {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("could not unmarshal template data from rpc request (%s)", err)}
	}

	template := state.NewIssuanceTemplate(templateData.Name, templateData.Owner, templateData.Version, templateData.Data)
	return state.NewState(context).SaveTemplate(template)
}

//@Todo implement deleteIssuance
var deleteIssuance = func(request *processor_pb2.TpProcessRequest, context *processor.Context, rpcReq *credential_template_engine_pb.RPCRequest) error {
	var payload map[string][]string
	err := json.Unmarshal([]byte(rpcReq.Params), &payload)
	if err != nil {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("could not unmarshal template data from rpc request (%s)", err)}
	}

	if addresses, ok := payload["addresses"]; ok && len(addresses) > 0 {
		return state.NewState(context).DeleteTemplates(addresses...)
	} else {
		return &processor.InvalidTransactionError{Msg: "invalid transaction payload must specify list of addresses of templates to delete"}
	}
}

//@Todo implement updateIssuance
var updateIssuance = func(request *processor_pb2.TpProcessRequest, context *processor.Context, rpcReq *credential_template_engine_pb.RPCRequest) error {
	var templateData state.IssuanceTemplate
	err := json.Unmarshal([]byte(rpcReq.Params), &templateData)
	if err != nil {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("could not unmarshal template data from rpc request (%s)", err)}
	}

	return state.NewState(context).SaveTemplate(&templateData)
}

func init() {
	IssuanceHandlers = []*MethodHandler{
		{createIssuance, credential_template_engine_pb.Method_CREATE.String()},
		{createIssuance, credential_template_engine_pb.Method_UPDATE.String()},
		{createIssuance, credential_template_engine_pb.Method_DELETE.String()},
	}
}
