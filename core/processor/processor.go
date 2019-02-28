package processor

import (
	"sync"

	"github.com/BadgeForce/credential-issuing-engine/core/state"

	"github.com/rberg2/sawtooth-go-sdk/processor"

	"github.com/BadgeForce/credential-issuing-engine/core/rpc"
	"github.com/BadgeForce/sawtooth-utils"
)

//TODO: move FamilyName to configuration

// FamilyName processor family name
const FamilyName = "verifiable-credential"

//TODO: move NameSpaces to configuration

//TODO: move FamilyVersions to configuration

// FamilyVersions transaction processor versions
var FamilyVersions = []string{"1.0"}

var once sync.Once
var transactionHandler *utils.TransactionHandler
var transactionProcessor *processor.TransactionProcessor

// TransactionProcessor instantiates transaction processor once and return it
func TransactionProcessor(validator string) *processor.TransactionProcessor {
	once.Do(func() {
		transactionHandler = utils.NewTransactionHandler(rpc.Client, FamilyName, FamilyVersions, []string{state.VerifiableCredentialsPrefix})
		transactionProcessor = utils.NewTransactionProcessor(validator, transactionHandler)
	})

	return transactionProcessor
}
