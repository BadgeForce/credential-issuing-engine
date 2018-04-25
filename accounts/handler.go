package accounts

import (
	pb "github.com/BadgeForce/badgeforce-chain-node/accounts/accounts_pb"
	"github.com/BadgeForce/badgeforce-chain-node/common"
	"github.com/gogo/protobuf/proto"
	"github.com/rberg2/sawtooth-go-sdk/logging"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"github.com/rberg2/sawtooth-go-sdk/protobuf/processor_pb2"
)

var logger = logging.Get()

const (
	FAMILYNAME = "badgeforce_accounts"

	LOADACCOUNT     = "load_account_action"
	STOREPUBLICDATA = "store_public_data"
)

var (
	FAMILYVERSION = "1.0"
)

func StorePublicDataHandler(request *processor_pb2.TpProcessRequest, context *processor.Context) error {
	var accountData pb.Account_PublicData
	err := proto.Unmarshal(request.GetPayload(), &accountData)
	if err != nil {
		logger.Error(err)
		return &processor.InvalidTransactionError{Msg: "Invalid public account data"}
	}
	accountState := NewState(context)
	err = accountState.StorePublicData(request.GetHeader().GetSignerPublicKey(), accountData)
	if err != nil {
		logger.Error(err)
		return &processor.InvalidTransactionError{Msg: "Could not store public data"}
	}

	return nil
}

func NewAccountsTP() *common.TransactionHandler {
	actionMap := make(map[string]func(request *processor_pb2.TpProcessRequest, context *processor.Context) error)
	actionMap[STOREPUBLICDATA] = StorePublicDataHandler
	return common.NewTransactionHandler(FAMILYNAME, FAMILYVERSION, Namespace, actionMap)
}
