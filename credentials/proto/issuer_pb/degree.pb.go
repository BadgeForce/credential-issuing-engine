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
	Image         string `protobuf:"bytes,8,opt,name=image" json:"image,omitempty"`
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

func (m *Core) GetImage() string {
	if m != nil {
		return m.Image
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
	// 300 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0x54, 0x91, 0xc1, 0x4a, 0x3b, 0x31,
	0x10, 0xc6, 0xc9, 0xff, 0xdf, 0xd6, 0xee, 0x6c, 0x45, 0x18, 0xa4, 0xe4, 0x20, 0x5a, 0x8b, 0x87,
	0x1e, 0xa4, 0x07, 0x3d, 0x79, 0x94, 0x22, 0xd8, 0xeb, 0xfa, 0x00, 0x4b, 0xba, 0x99, 0xee, 0x0e,
	0xb4, 0xc9, 0x92, 0xa4, 0xe0, 0xbb, 0xf8, 0x7c, 0xbe, 0x87, 0x24, 0x5b, 0xbb, 0xf5, 0x36, 0xdf,
	0xef, 0x9b, 0x7c, 0x33, 0x43, 0x60, 0xa2, 0xa9, 0x76, 0x44, 0xcb, 0xd6, 0xd9, 0x60, 0x31, 0x63,
	0xef, 0x0f, 0xe4, 0xca, 0x76, 0x33, 0xff, 0x12, 0x80, 0xaf, 0x95, 0xd2, 0xb4, 0xe7, 0x6a, 0xe5,
	0x48, 0x93, 0x09, 0xac, 0x76, 0xf8, 0x08, 0x59, 0x65, 0x1d, 0x95, 0x6c, 0xb6, 0x56, 0x8a, 0x99,
	0x58, 0xe4, 0x4f, 0x57, 0xcb, 0xd3, 0xab, 0xe5, 0xca, 0x3a, 0x2a, 0xc6, 0xb1, 0x63, 0x6d, 0xb6,
	0x16, 0x6f, 0x20, 0xf3, 0x5c, 0x1b, 0x15, 0x0e, 0x8e, 0xe4, 0xbf, 0x99, 0x58, 0x64, 0x45, 0x0f,
	0xf0, 0x05, 0x26, 0x3e, 0x58, 0xa7, 0x6a, 0x2a, 0x1b, 0xe5, 0x1b, 0xf9, 0x3f, 0xc5, 0x4d, 0xcf,
	0xe2, 0x3e, 0x3a, 0xfb, 0x5d, 0xf9, 0xa6, 0xc8, 0x7d, 0x2f, 0xe6, 0xf7, 0x90, 0x9f, 0x79, 0x88,
	0x30, 0x48, 0x09, 0x22, 0x8d, 0x48, 0xf5, 0xfc, 0x5b, 0xc0, 0x20, 0xae, 0x13, 0x4d, 0xa3, 0xf6,
	0xf4, 0x6b, 0xc6, 0x1a, 0xa7, 0x30, 0xf2, 0x55, 0x63, 0xed, 0xee, 0xb8, 0xd5, 0x51, 0x45, 0xde,
	0x4d, 0x4f, 0xcb, 0x64, 0xc5, 0x51, 0xc5, 0x43, 0x1c, 0x55, 0xdc, 0x32, 0x99, 0x20, 0x07, 0xdd,
	0x21, 0x27, 0x80, 0x77, 0x90, 0x6b, 0x15, 0xa8, 0x24, 0xe5, 0x0c, 0x69, 0x39, 0x4c, 0x3e, 0x44,
	0xf4, 0x96, 0x08, 0x3e, 0xc0, 0x25, 0x1b, 0x1f, 0x38, 0x1c, 0x02, 0x5b, 0xb3, 0xd6, 0x72, 0x94,
	0x5a, 0xfe, 0x42, 0xbc, 0x05, 0xa0, 0xcf, 0x96, 0x9d, 0x8a, 0x5a, 0x5e, 0x74, 0x29, 0x3d, 0xc1,
	0x6b, 0x18, 0xf2, 0x5e, 0xd5, 0x24, 0xc7, 0xc9, 0xea, 0xc4, 0x66, 0x94, 0xbe, 0xee, 0xf9, 0x27,
	0x00, 0x00, 0xff, 0xff, 0x6c, 0xb8, 0x38, 0x96, 0xca, 0x01, 0x00, 0x00,
}
