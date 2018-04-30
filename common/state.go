package common

import "github.com/rberg2/sawtooth-go-sdk/processor"

// State ...
type State struct {
	Context *processor.Context
}

func (s *State) getState(address string) (map[string][]byte, error) {
	return s.Context.GetState([]string{address})
}

func (s *State) setState(state map[string][]byte) ([]string, error) {
	return s.Context.SetState(state)
}

func (s *State) deleteState(address string) ([]string, error) {
	return s.Context.DeleteState([]string{address})
}
