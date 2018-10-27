package state

import "github.com/rberg2/sawtooth-go-sdk/processor"

// State ...
type State struct {
	Context *processor.Context
	Prefix string
}

// NewStateInstance ...
func NewStateInstance(context *processor.Context, prefix string) *State {
	return &State{context, prefix}
}