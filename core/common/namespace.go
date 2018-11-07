package common

import (
	"crypto/sha512"
	"strings"
	"encoding/hex"
)

const (
	PrefixEndPos = 6
)

// NamespaceMngr
type NamespaceMngr struct {
	NameSpaces []string
}

func NewNamespaceMngr() *NamespaceMngr {
	return &NamespaceMngr{make([]string, 0)}
}

// ComputeDefaultPrefix returns namespace prefix of 6 bytes for our default prefixes that will be used to generate various state address's
func (s *NamespaceMngr) ComputeDefaultPrefix(prefix string) string {
	return HexDigest(prefix, 0, PrefixEndPos)
}

// RegisterNamespaces register a namespace with our state address manager
func (s *NamespaceMngr) RegisterNamespaces(prefixes ...string) *NamespaceMngr {
	for _, prefix := range prefixes {
		s.NameSpaces = append(s.NameSpaces, s.ComputeDefaultPrefix(prefix))
	}
	return s
}

// HexDigest returns hex digest sub-stringed by designated start and stop pos
func HexDigest(str string, startPos, endPos int64) string {
	hash := sha512.New()
	hash.Write([]byte(str))
	hashBytes := hash.Sum(nil)
	return strings.ToLower(hex.EncodeToString(hashBytes))[startPos:endPos]
}

