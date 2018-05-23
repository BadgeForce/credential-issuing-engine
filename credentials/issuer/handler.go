package issuer

import (
	"fmt"
	"syscall"

	"github.com/BadgeForce/badgeforce-chain-node/common"
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
func IssueCredentialHandler(request *processor_pb2.TpProcessRequest, context *processor.Context, data interface{}) error {
	var credential issuer_pb.AcademicCredential
	payload := data.(*issuer_pb.Payload)
	err := ptypes.UnmarshalAny(payload.Data.Data, &credential)
	if err != nil {
		logger.Error(err)
		return &processor.InvalidTransactionError{Msg: "Could determine the transaction action from payload"}
	}

	if err := VerifyDates([]string{credential.GetCoreInfo().GetDateEarned(), credential.GetCoreInfo().GetExpiration()}...); err != nil {
		logger.Error(err)
		return &processor.InvalidTransactionError{Msg: err.Error()}
	}

	poiHash, err := ComputeIntegrityHash(credential.GetCoreInfo())
	if err != nil {
		logger.Error(err)
		return &processor.InvalidTransactionError{Msg: "Could compute integrity hash"}
	}

	newIssuance := &issuer_pb.Issuance{
		Signature:            credential.GetSignature(),
		IssuerPublicKey:      request.GetHeader().GetSignerPublicKey(),
		RecipientPublicKey:   credential.GetCoreInfo().GetRecipient(),
		ProofOfIntegrityHash: poiHash,
	}

	err = issuance.NewIssuanceState(context).SaveIssuance(newIssuance)
	if err != nil {
		return &processor.InternalError{Msg: "Could not save issuance"}
	}

	err = academic.NewAcademicState(context).SaveCredential(credential)
	if err != nil {
		return &processor.InternalError{Msg: fmt.Sprintf("Could not save SaveCredential %v", err.Error())}
	}

	return nil
}

// RevokeCredentialHandler ...
func RevokeCredentialHandler(request *processor_pb2.TpProcessRequest, context *processor.Context, data interface{}) error {
	var revoke issuer_pb.Revoke
	payload := data.(*issuer_pb.Payload)
	err := ptypes.UnmarshalAny(payload.Data.Data, &revoke)
	if err != nil {
		logger.Error(err)
		return &processor.InvalidTransactionError{Msg: "Could determine the transaction action from payload"}
	}

	err = issuance.NewIssuanceState(context).Revoke(revoke.GetSignature(), request.GetHeader().GetSignerPublicKey())
	if err != nil {
		return &processor.InternalError{Msg: "Could not update issuance"}
	}

	return nil
}

// NewCredentialsTP ...
func NewCredentialsTP(validator string) *processor.TransactionProcessor {
	subHandlers := make(map[string]common.SubHandler)
	subHandlers[issuer_pb.PayloadAction_ISSUE.String()] = common.SubHandler{
		Handle: IssueCredentialHandler,
	}
	subHandlers[issuer_pb.PayloadAction_REVOKE.String()] = common.SubHandler{
		Handle: RevokeCredentialHandler,
	}

	credentialsHandler := common.NewTransactionHandler(FAMILYNAME, FAMILYVERSION, academic.Namespace, subHandlers)

	processor := processor.NewTransactionProcessor(validator)
	processor.AddHandler(credentialsHandler)
	processor.ShutdownOnSignal(syscall.SIGINT, syscall.SIGTERM)
	return processor
}
