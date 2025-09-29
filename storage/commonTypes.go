package main

import "sync"

type MasterConnected struct {
	MasterConnected bool
	RwLock          sync.RWMutex
}

type MessageTypes int

const (
	QUEUE MessageTypes = iota
	SUBSCRIBER
	STREAM
)

type Message struct {
	MessageType MessageTypes `json:"messageType"`
	Key         string       `json:"key"`
}
