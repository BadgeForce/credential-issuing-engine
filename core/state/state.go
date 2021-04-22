package state

import (
	"fmt"
	credential_pb "github.com/BadgeForce/credential-issuing-engine/core/credential_pb"
	"github.com/BadgeForce/sawtooth-utils"
	"github.com/golang/protobuf/proto"
	"github.com/golang/protobuf/ptypes"
	"github.com/rberg2/sawtooth-go-sdk/logging"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"github.com/spf13/viper"
	"time"
)

//TODO: move VerifiableCredentialsPrefix to configuration

// VerifiableCredentialsPrefix ...
const VerifiableCredentialsPrefix = "verifiable:credentials"

var (
	logger = logging.Get()

	// NameSpaceMngr ...
	NameSpaceMngr *utils.NamespaceMngr

	ipfs *utils.IPFSClient
)

// State ...
type State struct {
	instance *utils.State
}

// Context ...
func (s *State) Context() *processor.Context {
	return s.instance.Context
}

// GetTxtRecpt returns a transaction receipt with correct data
func (s *State) GetTxtRecpt(rpcMethod credential_pb.CredentialIssuingMethod, stateAddress string, credential *credential_pb.Credential) (*credential_pb.IssuingEngineReceipt, []byte, error) {
	var recpt credential_pb.IssuingEngineReceipt
	recpt.Date = time.Now().Unix()
	recpt.StateAddress = stateAddress
	recpt.RpcMethod = rpcMethod
	recpt.Credential = credential

	b, err := proto.Marshal(&recpt)
	return &recpt, b, err
}

// store data on IPFS
// set state

// Save saves a template template to state
func (s *State) Save(credential *credential_pb.Credential) error {
	var err error
	address := CredentialAddress(credential)

	//credential.Verification.IpfsFileName, credential.Verification.IpfsHash,  err = s.StoreExternalData(credential)
	//if err != nil {
	//	return &processor.InvalidTransactionError{Msg: fmt.Sprintf("unable to save credential proto data to IPFS(%s)", err)}
	//}

	b, err := proto.Marshal(credential)
	if err != nil {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("unable to marshal credential proto (%s)", err)}
	}

	_, err = s.Context().SetState(map[string][]byte{address: b})
	if err != nil {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("unable to save credential (%s)", err)}
	}

	_, receiptBytes, err := s.GetTxtRecpt(credential_pb.CredentialIssuingMethod_ISSUE, address, credential)
	if err != nil {
		logger.Warnf("unable to generate transaction receipt for credential save (%s)", err)
	}

	err = s.Context().AddReceiptData(receiptBytes)
	if err != nil {
		logger.Warnf("unable to add transaction receipt for credential saved (%s)", err)
	}

	return nil
}

// StoreExternalData stores credential Data on external decentralized system. As of now that system is IPFS.
//func (s *State) StoreExternalData(credential *credential_pb.Credential) (string, string, error) {
//	b, err := proto.Marshal(credential)
//	if err != nil {
//		return "", "", &processor.InvalidTransactionError{Msg: fmt.Sprintf("unable to marshal credential proto (%s)", err)}
//	}
//
//	return ipfs.AddFile(credential.GetData().GetTemplate().GetData().GetName(), "bfac",b )
//}

// Revoke revoke credentials stored at each address
func (s *State) Revoke(addresses ...string) error {
	update := make(map[string][]byte)

	verifications, err  := s.GetVerifications(addresses...)
	if err != nil {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("error reading state to revoke credentials (%s)", err)}
	}

	for _, credential := range verifications {
		credential.Verification.RevocationStatus.IsRevoked = true
		credential.Verification.RevocationStatus.RevokedAt = ptypes.TimestampNow()

		_, receiptBytes, err := s.GetTxtRecpt(credential_pb.CredentialIssuingMethod_REVOKE, CredentialAddress(credential), credential)
		if err != nil {
			logger.Warnf("unable to generate transaction receipt for credential revoke (%s)", err)
		}

		err = s.Context().AddReceiptData(receiptBytes)
		if err != nil {
			logger.Warnf("unable to generate transaction receipt for credential revoke (%s)", err)
		}
	}

	_, err = s.Context().SetState(update)
	if err != nil {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("unable to revoke credentials (%s)", err)}
	}

	return nil
}

// GetVerifications get some credentials stored at each specified address from state
func (s *State) GetVerifications(address ...string) ([]*credential_pb.Credential, error) {
	state, err := s.Context().GetState(address)
	if err != nil {
		return nil, &processor.InvalidTransactionError{Msg: fmt.Sprintf("could not get state (%s)", err)}
	}

	verifications := make([]*credential_pb.Credential, 0)
	for _, value := range state {
		var verification *credential_pb.Credential

		if err := proto.Unmarshal(value, verification); err != nil {
			return nil, &processor.InvalidTransactionError{Msg: fmt.Sprintf("could not unmarshal verification proto data from state (%s)", err)}
		} else {
			verifications = append(verifications, verification)
		}
	}

	return verifications, nil
}



func CredentialAddress(credential *credential_pb.Credential) string {
	recipient := utils.NewPart(credential.GetVerification().GetRecipientPub(), 0, 25)
	issuer := utils.NewPart(credential.GetVerification().GetIssuerPub(), 0, 25)
	name := utils.NewPart(credential.GetData().GetTemplate().GetData().GetName(), 0, 14)

	addressParts := []*utils.AddressPart{recipient, issuer, name}
	address, _ := utils.NewAddress(NameSpaceMngr.NameSpaces[0]).AddParts(addressParts...).Build()
	return address
}

// NewCredentialState ...
func NewCredentialState(context *processor.Context) *State {
	return &State{utils.NewStateInstance(context)}
}

func init() {
	NameSpaceMngr = utils.NewNamespaceMngr().RegisterNamespaces(VerifiableCredentialsPrefix)
	ipfs = utils.NewIPFSHTTPClient(viper.GetString("ipfs"))
}
