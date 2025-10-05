package types

import (
	"encoding/json"
	"net"
	"slices"

	"github.com/google/uuid"
)

type InternalClientData struct {
	ClientId      string
	Conn          net.Conn
	Subscriptions map[string][]SubscriptionType
}

type ConnectedClients struct {
	InternalData []InternalClientData
}

func (connectedClients *ConnectedClients) InsertClient(conn net.Conn) string {
	id := uuid.New().String()
	connectedClients.InternalData = append(connectedClients.InternalData, InternalClientData{
		ClientId:      id,
		Conn:          conn,
		Subscriptions: make(map[string][]SubscriptionType),
	})
	return id
}

func (connectedClients *ConnectedClients) RemoveClient(clientId string) {
	idx := -1
	for index, client := range connectedClients.InternalData {
		if client.ClientId == clientId {
			idx = index
			break
		}
	}
	if idx == -1 {
		return
	}
	connectedClients.InternalData = append(
		connectedClients.InternalData[:idx],
		connectedClients.InternalData[idx+1:]...,
	)
}

func (connectedClients *ConnectedClients) AddSubscription(id string, subscription string, messageType MessageTypes) {
	idx := -1
	for index, client := range connectedClients.InternalData {
		if client.ClientId == id {
			idx = index
			break
		}
	}
	if idx == -1 {
		return
	}
	if !slices.Contains(connectedClients.InternalData[idx].Subscriptions[subscription], SubscriptionType{
		MessageType: messageType,
	}) {
		connectedClients.InternalData[idx].Subscriptions[subscription] = append(connectedClients.InternalData[idx].Subscriptions[subscription], SubscriptionType{
			MessageType: messageType,
		})
	}
}

func (connectedClients *ConnectedClients) SendMessageToAllClients(subscriptionKey string, messageType MessageTypes, value []byte) {
	for _, client := range connectedClients.InternalData {
		subscription, ok := client.Subscriptions[subscriptionKey]
		if !ok {
			continue
		}
		for _, keys := range subscription {
			if keys.MessageType == messageType {
				jsonData, err := json.Marshal(map[string]any{
					"key":         subscriptionKey,
					"value":       value,
					"messageType": messageType,
				})
				if err != nil {
					continue
				}
				client.Conn.Write(append(jsonData, '\n'))
				break
			}
		}
	}
}
