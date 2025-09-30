package streamhandler

import (
	channelstructs "cacheServer/channelStructs"
	"slices"
	"time"
)

type StreamData struct {
	Value []byte
	Id    int64
}

type StreamHandler struct {
	Data             map[string][]StreamData
	SubscribedToKeys []string
	// this is the channel through which master creates the subscriptions by specifying the key to subscribe to
	SubscibeToChannel chan channelstructs.SubscribeChannelStruct
	// this is the channel to which the messages are transmitted to master after receiving incoming messages
	PublishToChannel chan channelstructs.PublishChannelStruct
}

func generateId() int64 {
	return time.Now().Unix()
}

// Adds data to the stream and returns the size to be added to final config CURRENTSIZE along with the id
func (streamHandler *StreamHandler) AddToStream(key string, data []byte) (int, int64) {
	id := generateId()
	_, ok := streamHandler.Data[key]
	if !ok {
		streamHandler.Data[key] = make([]StreamData, 0)
	}
	streamHandler.Data[key] = append(streamHandler.Data[key], StreamData{
		Value: data,
		Id:    id,
	})
	if slices.Contains(streamHandler.SubscribedToKeys, key) {
		streamHandler.PublishToChannel <- channelstructs.PublishChannelStruct{
			Key:   key,
			Value: data,
		}
	}
	return len(data) + 8, id
}

// Remove data from stream with an id and returns the size to be deleted from config CURRENTSIZE
func (streamHandler *StreamHandler) RemoveFromStream(key string, id int64) int {
	values, ok := streamHandler.Data[key]
	if !ok {
		return 0
	}
	idx := -1
	for index, value := range values {
		if value.Id == id {
			idx = index
			break
		}
	}
	if idx == -1 {
		return 0
	}
	valueToDelete := values[idx]
	values = append(values[:idx], values[idx+1:]...)
	streamHandler.Data[key] = values
	return len(valueToDelete.Value) + 8
}

// Returns the byte data in betweeen specific range ids
func (streamHandler *StreamHandler) ReturnSteamData(start int64, end int64, key string) [][]byte {
	values, ok := streamHandler.Data[key]
	res := [][]byte{}
	if !ok {
		return res
	}
	for _, value := range values {
		if value.Id >= start && value.Id <= end {
			res = append(res, value.Value)
		}
	}
	return res
}
