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
)

type GrpcMessage struct {
	MessageType GrpcMessageTypes `json:"messageType"`
	Input       json.RawMessage  `json:"input"`
}
