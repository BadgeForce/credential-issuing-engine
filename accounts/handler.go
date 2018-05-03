package accounts

import (
	"syscall"

	"github.com/BadgeForce/badgeforce-chain-node/accounts/proto/badgeforce_pb"
	"github.com/BadgeForce/badgeforce-chain-node/common"
	"github.com/golang/protobuf/ptypes"
	"github.com/rberg2/sawtooth-go-sdk/logging"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"github.com/rberg2/sawtooth-go-sdk/protobuf/processor_pb2"
)

var logger = logging.Get()

const (
	FAMILYNAME = "badgeforce_accounts"
)

var (
	FAMILYVERSION = "1.0"
)

func StorePublicDataHandler(request *processor_pb2.TpProcessRequest, context *processor.Context, data interface{}) error {
	var accountData badgeforce_pb.Account_PublicData
	payload := data.(badgeforce_pb.Payload)
	err := ptypes.UnmarshalAny(payload.Data.Data, &accountData)
	if err != nil {
		logger.Error(err)
		return &processor.InvalidTransactionError{Msg: "Could determine the transaction action from payload"}
	}
	accountState := NewState(context)
	err = accountState.StorePublicData(request.GetHeader().GetSignerPublicKey(), accountData)
	if err != nil {
		logger.Error(err)
		return &processor.InvalidTransactionError{Msg: "Could not store public data"}
	}

	return nil
}

func NewAccountsTP(validator string) *processor.TransactionProcessor {
	subHandlers := make(map[string]common.SubHandler)
	subHandlers[badgeforce_pb.PayloadAction_STOREPUBLICDATA.String()] = common.SubHandler{
		Handle: StorePublicDataHandler,
	}

	accountsHandler := common.NewTransactionHandler(FAMILYNAME, FAMILYVERSION, Namespace, subHandlers)

	processor := processor.NewTransactionProcessor(validator)
	processor.AddHandler(accountsHandler)
	processor.ShutdownOnSignal(syscall.SIGINT, syscall.SIGTERM)
	return processor
}
