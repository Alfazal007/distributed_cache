package types

import "sync"

type MasterConnected struct {
	MasterConnected bool
	RwLock          sync.RWMutex
}

type MessageTypes int

const (
	QUEUE MessageTypes = iota
	STREAM
	SUBSCRIBER
	PING
)

type Message struct {
	MessageType     MessageTypes `json:"messageType"`
	Key             string       `json:"key"`
	ShouldSubscribe bool         `json:"subscribe"`
}

type SubscriptionType struct {
	MessageType MessageTypes
}

type IncomingDataFromStorageToTcp struct {
	Value       []byte       `json:"value"`
	Key         string       `json:"key"`
	MessageType MessageTypes `json:"messageType"`
}
