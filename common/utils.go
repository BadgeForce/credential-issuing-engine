package common

import (
	"crypto/sha512"
	"encoding/hex"
	"strings"
)

// Hexdigest compute hexdigest, used for namespaces
func Hexdigest(str string) string {
	hash := sha512.New()
	hash.Write([]byte(str))
	hashBytes := hash.Sum(nil)
	return strings.ToLower(hex.EncodeToString(hashBytes))
}

// ComputeNamespace returns namespace prefix of 6 bytes
func ComputeNamespace(str string) string {
	return Hexdigest(str)[:6]
}

// MakeAddress . . .
func MakeAddress(prefix, postfix string) string {
	return prefix + Hexdigest(postfix)[:64]
}
