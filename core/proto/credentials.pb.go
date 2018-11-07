// Code generated by protoc-gen-go. DO NOT EDIT.
// source: credentials.proto

package badgeforce_pb

import proto "github.com/golang/protobuf/proto"
import fmt "fmt"
import math "math"

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

type Credential struct {
	Name                 string    `protobuf:"bytes,1,opt,name=name" json:"name,omitempty"`
	IssuerPublicKey      string    `protobuf:"bytes,2,opt,name=issuer_public_key,json=issuerPublicKey" json:"issuer_public_key,omitempty"`
	RecipientPublicKey   string    `protobuf:"bytes,3,opt,name=recipient_public_key,json=recipientPublicKey" json:"recipient_public_key,omitempty"`
	RevokationStatus     bool      `protobuf:"varint,4,opt,name=revokation_status,json=revokationStatus" json:"revokation_status,omitempty"`
	ProofOfIntegrityHash string    `protobuf:"bytes,5,opt,name=proof_of_integrity_hash,json=proofOfIntegrityHash" json:"proof_of_integrity_hash,omitempty"`
	StorageHash          string    `protobuf:"bytes,6,opt,name=storage_hash,json=storageHash" json:"storage_hash,omitempty"`
	Template             *Template `protobuf:"bytes,7,opt,name=template" json:"template,omitempty"`
	Expiration           int64     `protobuf:"varint,8,opt,name=expiration" json:"expiration,omitempty"`
	IssuedAt             int64     `protobuf:"varint,9,opt,name=issued_at,json=issuedAt" json:"issued_at,omitempty"`
	Signature            string    `protobuf:"bytes,10,opt,name=signature" json:"signature,omitempty"`
}

func (m *Credential) Reset()                    { *m = Credential{} }
func (m *Credential) String() string            { return proto.CompactTextString(m) }
func (*Credential) ProtoMessage()               {}
func (*Credential) Descriptor() ([]byte, []int) { return fileDescriptor1, []int{0} }

func (m *Credential) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

func (m *Credential) GetIssuerPublicKey() string {
	if m != nil {
		return m.IssuerPublicKey
	}
	return ""
}

func (m *Credential) GetRecipientPublicKey() string {
	if m != nil {
		return m.RecipientPublicKey
	}
	return ""
}

func (m *Credential) GetRevokationStatus() bool {
	if m != nil {
		return m.RevokationStatus
	}
	return false
}

func (m *Credential) GetProofOfIntegrityHash() string {
	if m != nil {
		return m.ProofOfIntegrityHash
	}
	return ""
}

func (m *Credential) GetStorageHash() string {
	if m != nil {
		return m.StorageHash
	}
	return ""
}

func (m *Credential) GetTemplate() *Template {
	if m != nil {
		return m.Template
	}
	return nil
}

func (m *Credential) GetExpiration() int64 {
	if m != nil {
		return m.Expiration
	}
	return 0
}

func (m *Credential) GetIssuedAt() int64 {
	if m != nil {
		return m.IssuedAt
	}
	return 0
}

func (m *Credential) GetSignature() string {
	if m != nil {
		return m.Signature
	}
	return ""
}

type Template struct {
	Owner   string `protobuf:"bytes,1,opt,name=owner" json:"owner,omitempty"`
	Name    string `protobuf:"bytes,2,opt,name=name" json:"name,omitempty"`
	Version string `protobuf:"bytes,3,opt,name=version" json:"version,omitempty"`
}

func (m *Template) Reset()                    { *m = Template{} }
func (m *Template) String() string            { return proto.CompactTextString(m) }
func (*Template) ProtoMessage()               {}
func (*Template) Descriptor() ([]byte, []int) { return fileDescriptor1, []int{1} }

func (m *Template) GetOwner() string {
	if m != nil {
		return m.Owner
	}
	return ""
}

func (m *Template) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

func (m *Template) GetVersion() string {
	if m != nil {
		return m.Version
	}
	return ""
}

func init() {
	proto.RegisterType((*Credential)(nil), "badgeforce_pb.Credential")
	proto.RegisterType((*Template)(nil), "badgeforce_pb.Template")
}

func init() { proto.RegisterFile("credentials.proto", fileDescriptor1) }

var fileDescriptor1 = []byte{
	// 334 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x54, 0x91, 0xdd, 0x4a, 0xf3, 0x40,
	0x10, 0x86, 0x49, 0x7f, 0x93, 0xe9, 0xf7, 0xa1, 0x5d, 0x0a, 0x5d, 0x50, 0x24, 0xf6, 0x28, 0x28,
	0x14, 0xb1, 0x78, 0x01, 0xe2, 0x89, 0x22, 0xa8, 0x44, 0xcf, 0x97, 0x4d, 0x3a, 0x49, 0x97, 0xb6,
	0xd9, 0xb0, 0xbb, 0xa9, 0xf6, 0x42, 0xbc, 0x5f, 0x71, 0xd2, 0xa6, 0xf5, 0x2c, 0xfb, 0x3e, 0x4f,
	0x98, 0x61, 0x5e, 0x18, 0xa6, 0x06, 0xe7, 0x58, 0x38, 0x25, 0x57, 0x76, 0x5a, 0x1a, 0xed, 0x34,
	0xfb, 0x9f, 0xc8, 0x79, 0x8e, 0x99, 0x36, 0x29, 0x8a, 0x32, 0x99, 0x7c, 0xb7, 0x01, 0x1e, 0x1a,
	0x89, 0x31, 0xe8, 0x14, 0x72, 0x8d, 0xdc, 0x0b, 0xbd, 0x28, 0x88, 0xe9, 0x9b, 0x5d, 0xc1, 0x50,
	0x59, 0x5b, 0xa1, 0x11, 0x65, 0x95, 0xac, 0x54, 0x2a, 0x96, 0xb8, 0xe5, 0x2d, 0x12, 0x4e, 0x6a,
	0xf0, 0x46, 0xf9, 0x33, 0x6e, 0xd9, 0x0d, 0x8c, 0x0c, 0xa6, 0xaa, 0x54, 0x58, 0xb8, 0x63, 0xbd,
	0x4d, 0x3a, 0x6b, 0xd8, 0xe1, 0x8f, 0x6b, 0x18, 0x1a, 0xdc, 0xe8, 0xa5, 0x74, 0x4a, 0x17, 0xc2,
	0x3a, 0xe9, 0x2a, 0xcb, 0x3b, 0xa1, 0x17, 0xf9, 0xf1, 0xe9, 0x01, 0xbc, 0x53, 0xce, 0xee, 0x60,
	0x5c, 0x1a, 0xad, 0x33, 0xa1, 0x33, 0xa1, 0x0a, 0x87, 0xb9, 0x51, 0x6e, 0x2b, 0x16, 0xd2, 0x2e,
	0x78, 0x97, 0x26, 0x8c, 0x08, 0xbf, 0x66, 0x4f, 0x7b, 0xf8, 0x28, 0xed, 0x82, 0x5d, 0xc2, 0x3f,
	0xeb, 0xb4, 0x91, 0x39, 0xd6, 0x6e, 0x8f, 0xdc, 0xc1, 0x2e, 0x23, 0x65, 0x06, 0xbe, 0xc3, 0x75,
	0xb9, 0x92, 0x0e, 0x79, 0x3f, 0xf4, 0xa2, 0xc1, 0xed, 0x78, 0xfa, 0xe7, 0x52, 0xd3, 0x8f, 0x1d,
	0x8e, 0x1b, 0x91, 0x5d, 0x00, 0xe0, 0x57, 0xa9, 0x0c, 0xad, 0xc8, 0xfd, 0xd0, 0x8b, 0xda, 0xf1,
	0x51, 0xc2, 0xce, 0x20, 0xa0, 0x03, 0xcd, 0x85, 0x74, 0x3c, 0x20, 0xec, 0xd7, 0xc1, 0xbd, 0x63,
	0xe7, 0x10, 0x58, 0x95, 0x17, 0xd2, 0x55, 0x06, 0x39, 0xd0, 0x46, 0x87, 0x60, 0xf2, 0x02, 0xfe,
	0x7e, 0x20, 0x1b, 0x41, 0x57, 0x7f, 0x16, 0x68, 0x76, 0xad, 0xd4, 0x8f, 0xa6, 0xaa, 0xd6, 0x51,
	0x55, 0x1c, 0xfa, 0x1b, 0x34, 0xf6, 0x77, 0x9b, 0xfa, 0xe2, 0xfb, 0x67, 0xd2, 0xa3, 0xf6, 0x67,
	0x3f, 0x01, 0x00, 0x00, 0xff, 0xff, 0x9b, 0x63, 0xbc, 0x7e, 0x12, 0x02, 0x00, 0x00,
}
