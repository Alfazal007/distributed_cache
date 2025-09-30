package channelstructs

type PublishChannelStruct struct {
	Value []byte `json:"value"`
	Key   string `json:"key"`
}

type SubscribeChannelStruct struct {
	Key             string
	ShouldSubscribe bool
}
