package utils

import (
	"fmt"
	"crypto/sha512"
	"strings"
	"encoding/hex"
	"crypto/md5"
)

// ComputeIntegrityHash ...
//func ComputeIntegrityHash(credential *issuer_pb.Core) (string, error) {
//	b, _ := proto.Marshal(credential)
//	return Hexdigest(string(b)), nil
//}

// MD5Sum compute md5 hash of some data that has been serialized to byte array
func MD5Sum(data []byte) string {
	return fmt.Sprintf("%x", md5.Sum(data))
}

// VerifyDates @Todo update this method
func VerifyDates(dates ...string) error {
	return nil
}

// Hexdigest compute hexdigest of string
func Hexdigest(str string) string {
	hash := sha512.New()
	hash.Write([]byte(str))
	hashBytes := hash.Sum(nil)
	return strings.ToLower(hex.EncodeToString(hashBytes))
}

// NamespacePrefixStr returns first string 6 bytes of Hexdigest of prefix string
func NamespacePrefixStr(str string) string {
	return Hexdigest(str)[:6]
}

// MakeAddress . . .
func MakeAddress(prefix, postfix string) string {
	return prefix + Hexdigest(postfix)[:64]
}

// IdentifierAddress . . .
func IdentifierAddress(prefix, identifier, postfix string) string {
	return prefix + Hexdigest(identifier)[:4] + Hexdigest(postfix)[:60]
}