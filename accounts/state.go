package accounts

import (
	"github.com/BadgeForce/badgeforce-chain-node/accounts/proto/badgeforce_pb"
	"github.com/BadgeForce/badgeforce-chain-node/common"
	"github.com/gogo/protobuf/proto"
	"github.com/rberg2/sawtooth-go-sdk/processor"
)

const prefix = "accounts"

// Namespace ...
var Namespace = common.ComputeNamespace(prefix)

// AccountState ...
type AccountState struct {
	context *processor.Context
}

func NewState(context *processor.Context) *AccountState {
	return &AccountState{
		context: context,
	}
}

func (s *AccountState) LoadAccount(publicKey string) (*badgeforce_pb.Account, error) {
	var accnt badgeforce_pb.Account
	address := common.MakeAddress(Namespace, publicKey)
	state, err := s.context.GetState([]string{address})
	if err != nil {
		return nil, &processor.InternalError{Msg: "Could not GetState"}
	}
	if len(state[address]) > 0 {
		proto.Unmarshal(state[address], &accnt)
		return &accnt, nil
	}

	return &badgeforce_pb.Account{PublicKey: publicKey}, nil
}

func (s *AccountState) StorePublicData(publicKey string, data badgeforce_pb.Account_PublicData) error {
	//validate this data
	address := common.MakeAddress(Namespace, publicKey)
	b, err := proto.Marshal(&data)
	if err != nil {
		logger.Error(err)
		return &processor.InvalidTransactionError{Msg: "Invalid data format"}
	}
	_, err = s.context.SetState(map[string][]byte{
		address: b,
	})
	if err != nil {
		logger.Errorf("ERROR", err, address)
		return &processor.InternalError{Msg: "Could not set state"}
	}

	return nil
}
