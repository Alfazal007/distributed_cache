package types

import (
	"encoding/json"
)

type GrpcMessageTypes int

const (
	MapInsert GrpcMessageTypes = iota
	MapFetch
	MapDelete

	QueueInsertFront
	QueueInsertBack
	QueueRemoveFront
	QueueRemoveBack

	InsertToSet
	GetSetValues
	SetHasMember
	SetRemoveMember

	InsertToSortedSet
	RemoveFromSortedSet
	GetScoreSortedSet
	GetRankSortedSet
	GetRankMembersAsc
	GetRankMembersDesc

	InsertDataToStream
	RemoveDataFromStream
	GetStreamRangeData

	InsertDataToHLL
	GetCountFromHLL
	MergeHll

	InsertToBf
	ExistsInBf

	PublishMessage
)

type GrpcMessage struct {
	RequestId   string           `json:"requestId"`
	Key         string           `json:"key"`
	MessageType GrpcMessageTypes `json:"messageType"`
	Input       json.RawMessage  `json:"input"`
}
