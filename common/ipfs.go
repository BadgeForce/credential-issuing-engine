package common

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"mime/multipart"
	"net/http"
	"time"

	"github.com/BadgeForce/badgeforce-chain-node/credentials/proto/issuer_pb"
	"github.com/gogo/protobuf/proto"
)

const (
	ADD        = "/api/v0/add"
	NOCOPY     = "nocopy=true"
	PATHPREFIX = "badgeforce"
)

// IPFSClient ...
type IPFSClient struct {
	Host string
	*http.Client
}

// ADDResp ...
type ADDResp struct {
	Name  string `json:"Name"`
	Hash  string `json:"Hash"`
	Bytes int64  `json:"Bytes"`
	Size  string `json:"Size"`
}

type BFAC struct {
	Data string `json:"data"`
}

// AddBACFile ...
func (ipfs *IPFSClient) AddBACFile(credential issuer_pb.AcademicCredential) (string, error) {
	protoB, _ := proto.Marshal(&credential)
	bfac := BFAC{Data: base64.RawStdEncoding.EncodeToString(protoB)}
	b, _ := json.Marshal(bfac)

	req, err := ipfs.NewIPFSAddReq(fmt.Sprintf("%v.bac", credential.GetSignature()), b, credential.GetCoreInfo().GetRecipient())
	if err != nil {
		return "", err
	}

	resp, err := ipfs.Do(req)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	var response ADDResp

	err = json.NewDecoder(resp.Body).Decode(&response)
	if err != nil {
		return "", err
	}

	return response.Hash, err
}

// NewIPFSAddReq ...
func (ipfs *IPFSClient) NewIPFSAddReq(fileName string, data []byte, recipient string) (*http.Request, error) {
	body := &bytes.Buffer{}
	writer := multipart.NewWriter(body)
	part, err := writer.CreateFormFile("file", fmt.Sprintf("%v%v", fileName, time.Now().UTC().String()))
	if err != nil {
		return nil, err
	}
	_, err = part.Write(data)
	if err != nil {
		return nil, err
	}

	err = writer.Close()
	if err != nil {
		return nil, err
	}

	uri := fmt.Sprintf("%v%v", ipfs.Host, ADD)
	req, err := http.NewRequest("POST", uri, body)
	req.Header.Set("Content-Type", writer.FormDataContentType())
	if err != nil {
		return nil, err
	}

	return req, nil
}

// NewIPFSHTTPClient ...
func NewIPFSHTTPClient(host string) *IPFSClient {
	return &IPFSClient{host, &http.Client{}}
}
