package accounts

import (
	"github.com/BadgeForce/badgeforce-chain-node/accounts/account"
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

func (s *AccountState) LoadAccount(publicKey string) (*account.Account, error) {
	var accnt account.Account
	address := common.MakeAddress(publicKey, Namespace)
	state, err := s.context.GetState([]string{address})
	if err != nil {
		return nil, &processor.InternalError{Msg: "Could not GetState"}
	}
	if len(state[address]) > 0 {
		proto.Unmarshal(state[address], &accnt)
		return &accnt, nil
	}

	return &account.Account{PublicKey: publicKey}, nil
}

func (s *AccountState) StorePublicData(publicKey string, data account.Account_PublicData) error {
	//validate this data
	address := common.MakeAddress(publicKey, Namespace)
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
