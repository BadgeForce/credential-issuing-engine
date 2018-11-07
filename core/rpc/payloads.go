package rpc

import (
	"encoding/json"
	"github.com/BadgeForce/badgeforce-chain-node/core/proto"
)

// PayloadDecoder helper struct that decodes JSON payloads from RPC request
type PayloadDecoder struct {
	req *badgeforce_pb.RPCRequest
}

// IssuePayload expected payload for ISSUE credential requests to handler
type IssuePayload struct {
	CredentialData string `json:"credential_data"`
	CredentialPB string `json:"credential_pb"`
}

// RevokePayload expected payload for REVOKE credentials requests to handler
type RevokePayload struct {
	Addresses []string `json:"addresses"`
}

// Bytes returns Params from RPCReq serialized to []byte
func (p *PayloadDecoder) Bytes() []byte {
	return []byte(p.req.Params)
}

// UnmarshalIssue un-marshals RPC Payloads for request with method ISSUE in expected JSON format
func (p *PayloadDecoder) UnmarshalIssue() (*IssuePayload, error) {
	var payload IssuePayload

	err := json.Unmarshal(p.Bytes(), &payload)
	if err != nil {
		return nil, err
	}

	return &payload, nil
}

// UnmarshalRevoke un-marshals RPC Payloads for request with method REVOKE in expected JSON format
func (p *PayloadDecoder) UnmarshalRevoke() (*RevokePayload, error) {
	var payload RevokePayload
	err := json.Unmarshal(p.Bytes(), &payload)
	if err != nil {
		return nil, err
	}

	return &payload, nil
}

func NewPayloadDecoder(req *badgeforce_pb.RPCRequest) *PayloadDecoder {
	return &PayloadDecoder{req}
}