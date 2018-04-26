package accounts

import (
	"fmt"
	"syscall"

	"github.com/BadgeForce/badgeforce-chain-node/accounts/account"
	"github.com/BadgeForce/badgeforce-chain-node/accounts/payload"
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
	var accountData account.Account_PublicData
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

func Delegate(request *processor_pb2.TpProcessRequest, subHandlers map[string]common.SubHandler) (common.SubHandler, error) {
	var action payload.PayloadHandler
	var subHandler common.SubHandler
	err := proto.Unmarshal(request.GetPayload(), &action)
	if err != nil {
		logger.Error(err)
		return subHandler, &processor.InvalidTransactionError{Msg: "Could determine the transaction action from payload"}
	}

	if subHandler, exists := subHandlers[action.GetAction()]; exists {
		return subHandler, nil
	}

	return subHandler, &processor.InvalidTransactionError{Msg: fmt.Sprintf("Invalid action for transaction: %v", action.GetAction())}
}

func NewAccountsTP(validator string) *processor.TransactionProcessor {
	subHandlers := make(map[string]common.SubHandler)
	subHandlers[STOREPUBLICDATA] = common.SubHandler{
		Handle: StorePublicDataHandler,
	}

	subHandlerDelegate := common.SubHandlerDelegate{
		GetSubHandler: Delegate,
	}

	accountsHandler := common.NewTransactionHandler(FAMILYNAME, FAMILYVERSION, Namespace, subHandlerDelegate, subHandlers)

	processor := processor.NewTransactionProcessor(validator)
	processor.AddHandler(accountsHandler)
	processor.ShutdownOnSignal(syscall.SIGINT, syscall.SIGTERM)
	return processor
}
