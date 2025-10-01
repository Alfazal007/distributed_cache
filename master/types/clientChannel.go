package types

import (
	"github.com/google/uuid"
)

type InnerStruct struct {
	Channel chan []byte
	Id      string
}

type ClientChannelsData struct {
	InnerStruct []InnerStruct
}

func (clientChannelsData *ClientChannelsData) CreateNewClient() string {
	id := uuid.New().String()
	clientChannelsData.InnerStruct = append(clientChannelsData.InnerStruct, InnerStruct{
		Channel: make(chan []byte),
		Id:      id,
	})
	return id
}

func (clientChannelsData *ClientChannelsData) RemoveClient(id string) {
	idx := -1
	for index, client := range clientChannelsData.InnerStruct {
		if client.Id == id {
			idx = index
			break
		}
	}
	if idx == -1 {
		return
	}
	clientChannelsData.InnerStruct = append(
		clientChannelsData.InnerStruct[:idx],
		clientChannelsData.InnerStruct[idx+1:]...,
	)
}

func (clientChannelsData *ClientChannelsData) SendMessageToClient(id string, data []byte) {
	idx := -1
	for _, client := range clientChannelsData.InnerStruct {
		if client.Id == id {
			client.Channel <- data
			break
		}
	}
	if idx == -1 {
		return
	}
}
