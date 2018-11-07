package common

import (
	"strings"
)

const MaxLength = 70

type AddressPart struct {
	Data           string
	DigestStartPos int64
	DigestEndPos   int64
}

func NewPart(data string, startPos, endPos int64) *AddressPart {
	return &AddressPart{data, startPos, endPos}
}

type AddressBuilder struct {
	Prefix   string
	Parts []*AddressPart
}

func NewAddress(prefix string) *AddressBuilder {
	return &AddressBuilder{prefix, make([]*AddressPart, 0)}
}

func (a *AddressBuilder) AddParts(part ...*AddressPart) *AddressBuilder {
	a.Parts = append(a.Parts, part...)
	return a
}

func (a *AddressBuilder) IsValidSize() bool {
	size := int64(len(a.Prefix))
	for _, part := range a.Parts {
		size = size + (part.DigestEndPos - part.DigestStartPos)
	}
	return size == MaxLength
}

func (a *AddressBuilder) Build() (string, bool) {
	var builder strings.Builder
	builder.WriteString(a.Prefix)

	for _, part := range a.Parts {

		digest := HexDigest(part.Data, part.DigestStartPos, part.DigestEndPos)
		if part.DigestStartPos > part.DigestEndPos || part.DigestEndPos > int64(len(digest)) {
			return "", false
		}

		builder.WriteString(digest)
	}

	return builder.String(), a.IsValidSize()
}
