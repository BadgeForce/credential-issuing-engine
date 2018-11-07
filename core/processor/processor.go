package processor

import (
	"github.com/BadgeForce/badgeforce-chain-node/core/common"
	"sync"
	"github.com/rberg2/sawtooth-go-sdk/processor"
	"github.com/BadgeForce/badgeforce-chain-node/core/state"
	"github.com/BadgeForce/badgeforce-chain-node/core/rpc"
)

// @Todo move FamilyName to configuration
// FamilyName processor family name
const FamilyName = "verifiable-credentials"

// @Todo move NameSpaces to configuration
// Namespaces transaction processor namespaces
var Namespaces = state.NameSpaceMngr.NameSpaces

// @Todo move FamilyVersions to configuration
// FamilyVersions transaction processor versions
var FamilyVersions = []string{"1.0"}

var once sync.Once
var transactionHandler *common.TransactionHandler
var transactionProcessor *processor.TransactionProcessor

// TransactionProcessor instantiates transaction processor once and return it
func TransactionProcessor(validator string) *processor.TransactionProcessor {
	once.Do(func() {
		transactionHandler = common.NewTransactionHandler(rpc.NewClient(), FamilyName, FamilyVersions, Namespaces)
		transactionProcessor = common.NewTransactionProcessor(validator, transactionHandler)
	})

	return transactionProcessor
}
