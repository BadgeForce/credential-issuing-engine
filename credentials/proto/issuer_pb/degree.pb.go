// Code generated by protoc-gen-go. DO NOT EDIT.
// source: degree.proto

package issuer_pb

import proto "github.com/golang/protobuf/proto"
import fmt "fmt"
import math "math"

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

type AcademicCredential struct {
	CoreInfo    *Core        `protobuf:"bytes,1,opt,name=core_info,json=coreInfo" json:"core_info,omitempty"`
	Signature   string       `protobuf:"bytes,2,opt,name=signature" json:"signature,omitempty"`
	StorageHash *StorageHash `protobuf:"bytes,3,opt,name=storage_hash,json=storageHash" json:"storage_hash,omitempty"`
}

func (m *AcademicCredential) Reset()                    { *m = AcademicCredential{} }
func (m *AcademicCredential) String() string            { return proto.CompactTextString(m) }
func (*AcademicCredential) ProtoMessage()               {}
func (*AcademicCredential) Descriptor() ([]byte, []int) { return fileDescriptor2, []int{0} }

func (m *AcademicCredential) GetCoreInfo() *Core {
	if m != nil {
		return m.CoreInfo
	}
	return nil
}

func (m *AcademicCredential) GetSignature() string {
	if m != nil {
		return m.Signature
	}
	return ""
}

func (m *AcademicCredential) GetStorageHash() *StorageHash {
	if m != nil {
		return m.StorageHash
	}
	return nil
}

type StorageHash struct {
	Hash string `protobuf:"bytes,1,opt,name=hash" json:"hash,omitempty"`
}

func (m *StorageHash) Reset()                    { *m = StorageHash{} }
func (m *StorageHash) String() string            { return proto.CompactTextString(m) }
func (*StorageHash) ProtoMessage()               {}
func (*StorageHash) Descriptor() ([]byte, []int) { return fileDescriptor2, []int{1} }

func (m *StorageHash) GetHash() string {
	if m != nil {
		return m.Hash
	}
	return ""
}

type Core struct {
	Name          string `protobuf:"bytes,1,opt,name=name" json:"name,omitempty"`
	School        string `protobuf:"bytes,2,opt,name=school" json:"school,omitempty"`
	Issuer        string `protobuf:"bytes,3,opt,name=issuer" json:"issuer,omitempty"`
	Recipient     string `protobuf:"bytes,4,opt,name=recipient" json:"recipient,omitempty"`
	DateEarned    string `protobuf:"bytes,5,opt,name=date_earned,json=dateEarned" json:"date_earned,omitempty"`
	InstitutionId string `protobuf:"bytes,6,opt,name=institutionId" json:"institutionId,omitempty"`
	Expiration    string `protobuf:"bytes,7,opt,name=expiration" json:"expiration,omitempty"`
}

func (m *Core) Reset()                    { *m = Core{} }
func (m *Core) String() string            { return proto.CompactTextString(m) }
func (*Core) ProtoMessage()               {}
func (*Core) Descriptor() ([]byte, []int) { return fileDescriptor2, []int{2} }

func (m *Core) GetName() string {
	if m != nil {
		return m.Name
	}
	return ""
}

func (m *Core) GetSchool() string {
	if m != nil {
		return m.School
	}
	return ""
}

func (m *Core) GetIssuer() string {
	if m != nil {
		return m.Issuer
	}
	return ""
}

func (m *Core) GetRecipient() string {
	if m != nil {
		return m.Recipient
	}
	return ""
}

func (m *Core) GetDateEarned() string {
	if m != nil {
		return m.DateEarned
	}
	return ""
}

func (m *Core) GetInstitutionId() string {
	if m != nil {
		return m.InstitutionId
	}
	return ""
}

func (m *Core) GetExpiration() string {
	if m != nil {
		return m.Expiration
	}
	return ""
}

func init() {
	proto.RegisterType((*AcademicCredential)(nil), "issuer_pb.AcademicCredential")
	proto.RegisterType((*StorageHash)(nil), "issuer_pb.StorageHash")
	proto.RegisterType((*Core)(nil), "issuer_pb.Core")
}

func init() { proto.RegisterFile("degree.proto", fileDescriptor2) }

var fileDescriptor2 = []byte{
	// 288 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x54, 0x91, 0xb1, 0x4e, 0xc3, 0x30,
	0x10, 0x86, 0x65, 0x28, 0x81, 0x5c, 0x8a, 0x90, 0x3c, 0x54, 0x1e, 0x10, 0x94, 0x88, 0xa1, 0x03,
	0xca, 0x00, 0x13, 0x23, 0xaa, 0x90, 0xe8, 0x1a, 0x1e, 0x20, 0x72, 0xe3, 0x6b, 0x62, 0xa9, 0xb5,
	0xa3, 0xb3, 0x23, 0xf1, 0x2e, 0x3c, 0x14, 0xaf, 0x84, 0xec, 0x84, 0xa6, 0x6c, 0xf7, 0x7f, 0xff,
	0xf9, 0xbf, 0x3b, 0x19, 0xe6, 0x0a, 0x1b, 0x42, 0x2c, 0x3a, 0xb2, 0xde, 0xf2, 0x54, 0x3b, 0xd7,
	0x23, 0x55, 0xdd, 0x36, 0xff, 0x66, 0xc0, 0xdf, 0x6a, 0xa9, 0xf0, 0xa0, 0xeb, 0x35, 0xa1, 0x42,
	0xe3, 0xb5, 0xdc, 0xf3, 0x27, 0x48, 0x6b, 0x4b, 0x58, 0x69, 0xb3, 0xb3, 0x82, 0x2d, 0xd9, 0x2a,
	0x7b, 0xbe, 0x29, 0x8e, 0xaf, 0x8a, 0xb5, 0x25, 0x2c, 0xaf, 0x42, 0xc7, 0xc6, 0xec, 0x2c, 0xbf,
	0x85, 0xd4, 0xe9, 0xc6, 0x48, 0xdf, 0x13, 0x8a, 0xb3, 0x25, 0x5b, 0xa5, 0xe5, 0x04, 0xf8, 0x2b,
	0xcc, 0x9d, 0xb7, 0x24, 0x1b, 0xac, 0x5a, 0xe9, 0x5a, 0x71, 0x1e, 0xe3, 0x16, 0x27, 0x71, 0x9f,
	0x83, 0xfd, 0x21, 0x5d, 0x5b, 0x66, 0x6e, 0x12, 0xf9, 0x03, 0x64, 0x27, 0x1e, 0xe7, 0x30, 0x8b,
	0x09, 0x2c, 0x8e, 0x88, 0x75, 0xfe, 0xc3, 0x60, 0x16, 0xd6, 0x09, 0xa6, 0x91, 0x07, 0xfc, 0x33,
	0x43, 0xcd, 0x17, 0x90, 0xb8, 0xba, 0xb5, 0x76, 0x3f, 0x6e, 0x35, 0xaa, 0xc0, 0x87, 0xe9, 0x71,
	0x99, 0xb4, 0x1c, 0x55, 0x38, 0x84, 0xb0, 0xd6, 0x9d, 0x46, 0xe3, 0xc5, 0x6c, 0x38, 0xe4, 0x08,
	0xf8, 0x3d, 0x64, 0x4a, 0x7a, 0xac, 0x50, 0x92, 0x41, 0x25, 0x2e, 0xa2, 0x0f, 0x01, 0xbd, 0x47,
	0xc2, 0x1f, 0xe1, 0x5a, 0x1b, 0xe7, 0xb5, 0xef, 0xbd, 0xb6, 0x66, 0xa3, 0x44, 0x12, 0x5b, 0xfe,
	0x43, 0x7e, 0x07, 0x80, 0x5f, 0x9d, 0x26, 0x19, 0xb4, 0xb8, 0x1c, 0x52, 0x26, 0xb2, 0x4d, 0xe2,
	0x27, 0xbd, 0xfc, 0x06, 0x00, 0x00, 0xff, 0xff, 0xca, 0xbb, 0x7b, 0x1d, 0xb4, 0x01, 0x00, 0x00,
}
