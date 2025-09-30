package types

import (
	"encoding/json"
)

type GrpcMessageTypes int

const (
	MapInsert GrpcMessageTypes = iota
	MapFetch
	MapDelete
)

type GrpcMessage struct {
	MessageType GrpcMessageTypes `json:"messageType"`
	Input       json.RawMessage  `json:"input"`
}
