// Code generated by protoc-gen-go. DO NOT EDIT.
// source: payload.proto

/*
Package issuer_pb is a generated protocol buffer package.

It is generated from these files:
	payload.proto
	issuance.proto
	degree.proto

It has these top-level messages:
	Payload
	AnyData
	Issuance
	AcademicCredential
	StorageHash
	Core
*/
package issuer_pb

import proto "github.com/golang/protobuf/proto"
import fmt "fmt"
import math "math"
import google_protobuf "github.com/golang/protobuf/ptypes/any"

// Reference imports to suppress errors if they are not otherwise used.
var _ = proto.Marshal
var _ = fmt.Errorf
var _ = math.Inf

// This is a compile-time assertion to ensure that this generated file
// is compatible with the proto package it is being compiled against.
// A compilation error at this line likely means your copy of the
// proto package needs to be updated.
const _ = proto.ProtoPackageIsVersion2 // please upgrade the proto package

type PayloadAction int32

const (
	PayloadAction_ISSUE  PayloadAction = 0
	PayloadAction_REVOKE PayloadAction = 1
)

var PayloadAction_name = map[int32]string{
	0: "ISSUE",
	1: "REVOKE",
}
var PayloadAction_value = map[string]int32{
	"ISSUE":  0,
	"REVOKE": 1,
}

func (x PayloadAction) String() string {
	return proto.EnumName(PayloadAction_name, int32(x))
}
func (PayloadAction) EnumDescriptor() ([]byte, []int) { return fileDescriptor0, []int{0} }

type Payload struct {
	Action PayloadAction `protobuf:"varint,1,opt,name=action,enum=issuer_pb.PayloadAction" json:"action,omitempty"`
	Data   *AnyData      `protobuf:"bytes,2,opt,name=data" json:"data,omitempty"`
}

func (m *Payload) Reset()                    { *m = Payload{} }
func (m *Payload) String() string            { return proto.CompactTextString(m) }
func (*Payload) ProtoMessage()               {}
func (*Payload) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{0} }

func (m *Payload) GetAction() PayloadAction {
	if m != nil {
		return m.Action
	}
	return PayloadAction_ISSUE
}

func (m *Payload) GetData() *AnyData {
	if m != nil {
		return m.Data
	}
	return nil
}

type AnyData struct {
	Data *google_protobuf.Any `protobuf:"bytes,1,opt,name=data" json:"data,omitempty"`
}

func (m *AnyData) Reset()                    { *m = AnyData{} }
func (m *AnyData) String() string            { return proto.CompactTextString(m) }
func (*AnyData) ProtoMessage()               {}
func (*AnyData) Descriptor() ([]byte, []int) { return fileDescriptor0, []int{1} }

func (m *AnyData) GetData() *google_protobuf.Any {
	if m != nil {
		return m.Data
	}
	return nil
}

func init() {
	proto.RegisterType((*Payload)(nil), "issuer_pb.Payload")
	proto.RegisterType((*AnyData)(nil), "issuer_pb.AnyData")
	proto.RegisterEnum("issuer_pb.PayloadAction", PayloadAction_name, PayloadAction_value)
}

func init() { proto.RegisterFile("payload.proto", fileDescriptor0) }

var fileDescriptor0 = []byte{
	// 194 bytes of a gzipped FileDescriptorProto
	0x1f, 0x8b, 0x08, 0x00, 0x00, 0x00, 0x00, 0x00, 0x02, 0xff, 0xe2, 0xe2, 0x2d, 0x48, 0xac, 0xcc,
	0xc9, 0x4f, 0x4c, 0xd1, 0x2b, 0x28, 0xca, 0x2f, 0xc9, 0x17, 0xe2, 0xcc, 0x2c, 0x2e, 0x2e, 0x4d,
	0x2d, 0x8a, 0x2f, 0x48, 0x92, 0x92, 0x4c, 0xcf, 0xcf, 0x4f, 0xcf, 0x49, 0xd5, 0x07, 0x4b, 0x24,
	0x95, 0xa6, 0xe9, 0x27, 0xe6, 0x55, 0x42, 0x54, 0x29, 0x25, 0x73, 0xb1, 0x07, 0x40, 0xb4, 0x09,
	0x19, 0x70, 0xb1, 0x25, 0x26, 0x97, 0x64, 0xe6, 0xe7, 0x49, 0x30, 0x2a, 0x30, 0x6a, 0xf0, 0x19,
	0x49, 0xe8, 0xc1, 0x4d, 0xd0, 0x83, 0xaa, 0x71, 0x04, 0xcb, 0x07, 0x41, 0xd5, 0x09, 0xa9, 0x71,
	0xb1, 0xa4, 0x24, 0x96, 0x24, 0x4a, 0x30, 0x29, 0x30, 0x6a, 0x70, 0x1b, 0x09, 0x21, 0xa9, 0x77,
	0xcc, 0xab, 0x74, 0x49, 0x2c, 0x49, 0x0c, 0x02, 0xcb, 0x2b, 0x19, 0x73, 0xb1, 0x43, 0x05, 0x84,
	0x34, 0xa0, 0x5a, 0x18, 0xc1, 0x5a, 0x44, 0xf4, 0x20, 0x2e, 0xd3, 0x83, 0xb9, 0x0c, 0xa4, 0x11,
	0xa2, 0x49, 0x4b, 0x8d, 0x8b, 0x17, 0xc5, 0x56, 0x21, 0x4e, 0x2e, 0x56, 0xcf, 0xe0, 0xe0, 0x50,
	0x57, 0x01, 0x06, 0x21, 0x2e, 0x2e, 0xb6, 0x20, 0xd7, 0x30, 0x7f, 0x6f, 0x57, 0x01, 0xc6, 0x24,
	0x36, 0xb0, 0x5e, 0x63, 0x40, 0x00, 0x00, 0x00, 0xff, 0xff, 0x19, 0x76, 0x83, 0x9c, 0xff, 0x00,
	0x00, 0x00,
}
