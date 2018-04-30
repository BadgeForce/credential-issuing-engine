package issuer

import (
	"github.com/BadgeForce/badgeforce-chain-node/credentials/academic"
	"github.com/BadgeForce/badgeforce-chain-node/credentials/issuance"
	issuer_pb "github.com/BadgeForce/badgeforce-chain-node/credentials/proto/issuer_pb"
	"github.com/golang/protobuf/ptypes"
	"github.com/rberg2/sawtooth-go-sdk/logging"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"github.com/rberg2/sawtooth-go-sdk/protobuf/processor_pb2"
)

var logger = logging.Get()

const (
	FAMILYNAME = "badgeforce_issuer"
)

var (
	FAMILYVERSION = "1.0"
)

// IssueCredentialHandler ...
func IssueCredentialHandler(request *processor_pb2.TpProcessRequest, context *processor.Context, payload *issuer_pb.Payload) error {
	var coreData issuer_pb.Core
	err := ptypes.UnmarshalAny(payload.Data.Data, &coreData)
	if err != nil {
		logger.Error(err)
		return &processor.InvalidTransactionError{Msg: "Could determine the transaction action from payload"}
	}

	// set signature , check issuer property
	poiHash, err := ComputeIntegrityHash(&coreData)
	if err != nil {
		logger.Error(err)
		return &processor.InvalidTransactionError{Msg: "Could compute integrity hash"}
	}

	coreData.BadgeforceData = &issuer_pb.VerifyHelperData{
		ProofOfIntegrityHash: &issuer_pb.ProofOfIntegrity{Hash: poiHash},
		RevokationStatus:     false,
	}

	issuance := issuer_pb.Issuance{
		Signature: coreData.GetSignature(),
		IssuerPublicKey: request.GetHeader().GetSignerPublicKey(),
		RecipientPublicKey: coreData.GetRecipient(), 
		ProofOfIntegrityHash: coreData.GetBadgeforceData().GetProofOfIntegrityHash().GetHash() 
	}

	
	issuanceState := issuance.NewIssuanceState(context)
	// save issuance
	credentialState := academic.NewAcademicState(context)
	// save ipfs hash in credentialState
	
	// accountState := NewState(context)
	// err = accountState.StorePublicData(request.GetHeader().GetSignerPublicKey(), accountData)
	// if err != nil {
	// 	logger.Error(err)
	// 	return &processor.InvalidTransactionError{Msg: "Could not store public data"}
	// }

	return nil
}

// func NewAccountsTP(validator string) *processor.TransactionProcessor {
// 	subHandlers := make(map[string]common.SubHandler)
// 	subHandlers[badgeforce_pb.PayloadAction_STOREPUBLICDATA.String()] = common.SubHandler{
// 		Handle: StorePublicDataHandler,
// 	}

// 	accountsHandler := common.NewTransactionHandler(FAMILYNAME, FAMILYVERSION, Namespace, subHandlers)

// 	processor := processor.NewTransactionProcessor(validator)
// 	processor.AddHandler(accountsHandler)
// 	processor.ShutdownOnSignal(syscall.SIGINT, syscall.SIGTERM)
// 	return processor
// }
