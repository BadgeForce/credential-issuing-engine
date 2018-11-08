package ipfs

import (
	"encoding/json"
	"fmt"
	"github.com/rberg2/sawtooth-go-sdk/logging"
	"encoding/base64"
	"github.com/ipfs/go-ipfs-api"
	"bytes"
)

const (
	ADD        = "/api/v0/add"
	NOCOPY     = "nocopy=true"
	PATHPREFIX = "badgeforce"
)

var logger = logging.Get()

// IPFSClient ...
type IPFSClient struct {
	Host  string
	Shell *shell.Shell
}

// ADDResp ...
type ADDResp struct {
	Name  string `json:"Name"`
	Hash  string `json:"Hash"`
	Bytes int64  `json:"Bytes"`
	Size  string `json:"Size"`
}

type BFAC struct {
	Data      string `json:"data"`
	Recipient string `json:"recipient"`
	FileName  string `json:"file_name"`
}

// AddBACFile ...
func (ipfs *IPFSClient) AddBACFile(signature, recipient, data string) (string, error) {
	encoded := base64.RawStdEncoding.EncodeToString([]byte(data))
	fileName := fmt.Sprintf("%v.bfc", signature)
	bfac := &BFAC{Data: encoded, Recipient: recipient, FileName: fileName}
	b, _ := json.Marshal(bfac)

	return ipfs.Shell.Add(bytes.NewReader(b))
}

// NewIPFSHTTPClient ...
func NewIPFSHTTPClient(host string) *IPFSClient {
	return &IPFSClient{host, shell.NewShell(host)}
}
