package accounts

import (
	pb "github.com/BadgeForce/badgeforce-chain-node/accounts/accounts_pb"
	"github.com/BadgeForce/badgeforce-chain-node/common"
	"github.com/gogo/protobuf/proto"
	"github.com/rberg2/sawtooth-go-sdk/processor"
)

// Namespace ...
var Namespace = common.ComputeNamespace("accounts")

// AccountState ...
type AccountState struct {
	context *processor.Context
}

func NewState(context *processor.Context) *AccountState {
	return &AccountState{
		context: context,
	}
}

func (s *AccountState) LoadAccount(publicKey string) (*pb.Account, error) {
	var account pb.Account
	address := common.MakeAddress(publicKey, Namespace)
	state, err := s.context.GetState([]string{address})
	if err != nil {
		return nil, &processor.InternalError{Msg: "Could not GetState"}
	}
	if len(state[address]) > 0 {
		proto.Unmarshal(state[address], &account)
		return &account, nil
	}

	return &pb.Account{PublicKey: publicKey}, nil
}

func (s *AccountState) StorePublicData(publicKey string, data pb.Account_PublicData) error {
	//validate this data
	address := common.MakeAddress(publicKey, Namespace)
	b, err := proto.Marshal(&data)
	if err != nil {
		return &processor.InvalidTransactionError{Msg: "Invalid data format"}
	}
	_, err = s.context.SetState(map[string][]byte{
		address: b,
	})
	if err != nil {
		return &processor.InternalError{Msg: "Could not set state"}
	}

	return nil
}
