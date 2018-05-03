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
	var coreData issuer_pb.Core
	payload := data.(*issuer_pb.Payload)
	err := ptypes.UnmarshalAny(payload.Data.Data, &coreData)
	if err != nil {
		logger.Error(err)
		return &processor.InvalidTransactionError{Msg: "Could determine the transaction action from payload"}
	}

	poiHash, err := ComputeIntegrityHash(&coreData)
	if err != nil {
		logger.Error(err)
		return &processor.InvalidTransactionError{Msg: "Could compute integrity hash"}
	}

	coreData.BadgeforceData = &issuer_pb.VerifyHelperData{
		ProofOfIntegrityHash: &issuer_pb.ProofOfIntegrity{Hash: poiHash},
		RevokationStatus:     false,
	}

	newIssuance := &issuer_pb.Issuance{
		Signature:            coreData.GetSignature(),
		IssuerPublicKey:      request.GetHeader().GetSignerPublicKey(),
		RecipientPublicKey:   coreData.GetRecipient(),
		ProofOfIntegrityHash: coreData.GetBadgeforceData().GetProofOfIntegrityHash(),
	}

	issuanceState := issuance.NewIssuanceState(context)
	err = issuanceState.SaveIssuance(newIssuance)
	if err != nil {
		return &processor.InternalError{Msg: "Could not save issuance"}
	}

	credentialState := academic.NewAcademicState(context)
	logger.Debug(coreData.String())
	err = credentialState.SaveCredential(coreData)
	if err != nil {
		return &processor.InternalError{Msg: fmt.Sprintf("Could not save SaveCredential %v", err.Error())}
	}

	return nil
}

// NewCredentialsTP ...
func NewCredentialsTP(validator string) *processor.TransactionProcessor {
	subHandlers := make(map[string]common.SubHandler)
	subHandlers[issuer_pb.PayloadAction_ISSUE.String()] = common.SubHandler{
		Handle: IssueCredentialHandler,
	}

	credentialsHandler := common.NewTransactionHandler(FAMILYNAME, FAMILYVERSION, academic.Namespace, subHandlers)

	processor := processor.NewTransactionProcessor(validator)
	processor.AddHandler(credentialsHandler)
	processor.ShutdownOnSignal(syscall.SIGINT, syscall.SIGTERM)
	return processor
}
