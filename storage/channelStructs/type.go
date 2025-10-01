package channelstructs

import commontypes "cacheServer/commonTypes"

type PublishChannelStruct struct {
	Value       []byte                   `json:"value"`
	Key         string                   `json:"key"`
	MessageType commontypes.MessageTypes `json:"messageType"`
}

type SubscribeChannelStruct struct {
	Key             string
	ShouldSubscribe bool
}
