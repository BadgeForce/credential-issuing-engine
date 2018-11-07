package state

import (
	"fmt"
	"github.com/gogo/protobuf/proto"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"github.com/BadgeForce/badgeforce-chain-node/core/proto"
	"github.com/BadgeForce/badgeforce-chain-node/core/common"
	"time"
)

type CredentialState struct {
	instance *common.State
}

func (c *CredentialState) Context() *processor.Context {
	return c.instance.Context
}

func NewCredentialState(context *processor.Context) *CredentialState {
	return &CredentialState{common.NewStateInstance(context)}
}

func (c *CredentialState) SaveCredential(credential *badgeforce_pb.Credential, credentialData string, actor string) error {
	//ipfsClient := common.NewIPFSHTTPClient(IPFSCONN)
	//hash, err := ipfsClient.AddBACFile(credential)
	//if err != nil {
	//	return "", &processor.InvalidTransactionError{Msg: fmt.Sprintf("Could not save data to IPFS %v", err.Error())}
	//}

	//@Todo implement IPFS hashing for credentialData

	if credential.GetIssuerPublicKey() != actor {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("attempt by unauthorized actor to issue credential on behalf of someone else want (%s) got (%s)", actor, credential.GetIssuerPublicKey())}
	}

	credential.ProofOfIntegrityHash = common.ProofOfIntegrityHash([]byte(credentialData))
	credential.IssuedAt = time.Now().Unix()
	//@Todo set storage_hash

	address := CredentialAddress(credential)
	b, err := proto.Marshal(credential)
	if err != nil {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("unable to marshal credential proto data (%s)", err)}
	}

	_, err = c.Context().SetState(map[string][]byte{address:b})
	if err != nil {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("unable to save credential (%s)", err)}
	}

	return nil
}

func (c *CredentialState) RevokeCredentials(actor string, addresses ...string) error {
	stateUpdate := make(map[string][]byte)
	credentials, err := c.GetCredentials(addresses...)
	if err != nil {
		return err
	}

	for _, credential := range credentials {
		if credential.GetIssuerPublicKey() != actor {
			return &processor.InvalidTransactionError{Msg: fmt.Sprintf("attempt by unauthorized actor to revoke credential (%s)", actor)}
		}

		credential.RevokationStatus = true
		address := CredentialAddress(credential)
		b, err := proto.Marshal(credential)
		if err != nil {
			return &processor.InvalidTransactionError{Msg: fmt.Sprintf("unable to marshal credential proto data (%s)", err)}
		}
		stateUpdate[address] = b
	}

	_, err = c.Context().SetState(stateUpdate)
	if err != nil {
		return &processor.InvalidTransactionError{Msg: fmt.Sprintf("unable to revoke credential(s) (%s)", err)}
	}

	return nil
}

func (c *CredentialState) GetCredentials(addresses ...string) ([]*badgeforce_pb.Credential, error) {
	state, err := c.Context().GetState(addresses)
	if err != nil {
		return nil, &processor.InvalidTransactionError{Msg: fmt.Sprintf("could not get credentials from state (%s)", err)}
	}

	credentials := make([]*badgeforce_pb.Credential, 0)
	for _, credential := range state {
		var cred badgeforce_pb.Credential
		err := proto.Unmarshal(credential, &cred)
		if err != nil {
			return nil, &processor.InvalidTransactionError{Msg: fmt.Sprintf("could not unmarshal json data (%s)", err)}
		}
		credentials = append(credentials, &cred)
	}

	return credentials, nil
}

