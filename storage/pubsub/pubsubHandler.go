package pubsub

import (
	channelstructs "cacheServer/channelStructs"
	commontypes "cacheServer/commonTypes"
	"slices"
)

type PubSubStruct struct {
	SubscribedToKeys []string
	// this is the channel through which master creates the subscriptions by specifying the key to subscribe to
	SubscibeToChannel chan channelstructs.SubscribeChannelStruct
	// this is the channel to which the messages are transmitted to master after receiving incoming messages
	PublishToChannel chan channelstructs.PublishChannelStruct
}

// This sends data to the pubsub channel
func (pubsub *PubSubStruct) InsertToPubSub(key string, value []byte) {
	if slices.Contains(pubsub.SubscribedToKeys, key) {
		pubsub.PublishToChannel <- channelstructs.PublishChannelStruct{
			Key:         key,
			Value:       value,
			MessageType: commontypes.SUBSCRIBER,
		}
	}
}
