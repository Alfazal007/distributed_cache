package datahandler

import (
	"cacheServer/config"
	maphandler "cacheServer/mapHandler"
	queuehandler "cacheServer/queueHandler"
	sethandler "cacheServer/setHandler"
	sortedsethandler "cacheServer/sortedSetHandler"
)

type Writer struct {
	HashMap   maphandler.Map
	Queue     queuehandler.Queue
	Set       sethandler.SetData
	SortedSet sortedsethandler.SortedSetStruct
}

func (writer *Writer) WriteToHashMap(key string, value []byte) bool {
	lengthToBeAdded := config.CURRENTSIZE + len(key) + len(value) + 8 + 8
	if lengthToBeAdded >= config.TOTALSIZE {
		return false
	}
	prevLength, newLength := writer.HashMap.Insert(key, value)
	config.CURRENTSIZE = config.CURRENTSIZE + newLength - prevLength
	return true
}

func (writer *Writer) GetValueFromHashMap(key string) []byte {
	value, success := writer.HashMap.Get(key)
	if !success {
		return nil
	}
	return value
}

func (writer *Writer) DeleteValueFromHashMap(key string) bool {
	success, deletedSize := writer.HashMap.Delete(key)
	if success {
		config.CURRENTSIZE = config.CURRENTSIZE - deletedSize
	}
	return success
}

// This function will try to free up space for all the data types being stored in the memory
func (writer *Writer) FreeUpSpace() {
	switch config.CURRENTDELETIONPROTOCOL {
	case config.SAMPLING:
		writer.HashMap.SamplingDelete()
	case config.LFU:
		writer.HashMap.LfuDelete()
	case config.LRU:
		writer.HashMap.LruDelete()
	}
}

func (writer *Writer) InsertFrontOfQueue(key string, value []byte) bool {
	lengthToBeAdded := config.CURRENTSIZE + len(value)
	if lengthToBeAdded >= config.TOTALSIZE {
		return false
	}
	lenWritten := writer.Queue.InsertFront(key, value)
	config.CURRENTSIZE = config.CURRENTSIZE + lenWritten
	return true
}

func (writer *Writer) InsertBackOfQueue(key string, value []byte) bool {
	lengthToBeAdded := config.CURRENTSIZE + len(value)
	if lengthToBeAdded >= config.TOTALSIZE {
		return false
	}
	lenWritten := writer.Queue.InsertBack(key, value)
	config.CURRENTSIZE = config.CURRENTSIZE + lenWritten
	return true
}

func (writer *Writer) DeleteFrontOfQueue(key string) (bool, []byte) {
	data, lenToBeDeleted := writer.Queue.RemoveFront(key)
	config.CURRENTSIZE = config.CURRENTSIZE - lenToBeDeleted
	if lenToBeDeleted == 0 {
		return false, nil
	}
	return true, data
}

func (writer *Writer) DeleteBackOfQueue(key string) (bool, []byte) {
	data, lenToBeDeleted := writer.Queue.RemoveBack(key)
	config.CURRENTSIZE = config.CURRENTSIZE - lenToBeDeleted
	if lenToBeDeleted == 0 {
		return false, nil
	}
	return true, data
}

func (writer *Writer) InsertToSet(key string, values []string) bool {
	lengthToBeAdded := config.CURRENTSIZE
	for _, value := range values {
		lengthToBeAdded += len(value)
	}
	if lengthToBeAdded >= config.TOTALSIZE {
		return false
	}
	sizeAdded := 0
	for _, value := range values {
		newSize := writer.Set.AddToSet(key, value)
		sizeAdded += newSize
	}
	config.CURRENTSIZE += sizeAdded
	return true
}

func (writer *Writer) RemoveFromSet(key string, value string) bool {
	success, size := writer.Set.RemoveFromSet(key, value)
	if !success {
		return false
	}
	config.CURRENTSIZE -= size
	return true
}

func (writer *Writer) ExistsInSet(key string, value string) bool {
	exists := writer.Set.ExistsInSet(key, value)
	return exists
}

func (writer *Writer) GetSetMembers(key string) []string {
	data := writer.Set.GetMembers(key)
	values := []string{}
	for key := range data {
		values = append(values, key)
	}
	return values
}

func (writer *Writer) InsertToSortedSet(key, mainKey string, value int64) bool {
	newSize := config.CURRENTSIZE + len(key) + len(key) + 8 + 8
	if newSize >= config.TOTALSIZE {
		return false
	}
	addedSize := writer.SortedSet.InsertToSet(key, value, mainKey)
	config.CURRENTSIZE += addedSize
	return true
}

func (writer *Writer) RemoveFromSortedSet(key, mainKey string) bool {
	removedSize := writer.SortedSet.RemoveFromSet(key, mainKey)
	config.CURRENTSIZE -= removedSize
	return true
}

func (writer *Writer) GetScoreFromSortedSet(key, mainKey string) int64 {
	score := writer.SortedSet.GetScore(key, mainKey)
	return score
}

func (writer *Writer) GetRankFromSortedSet(key, mainKey string) int32 {
	rank := writer.SortedSet.GetRank(key, mainKey)
	return rank
}

func (writer *Writer) GetRankAndMembersAscFromSortedSet(mainKey string) []sortedsethandler.ScoreKey {
	rankRes := writer.SortedSet.GetRankAndMembersAsc(mainKey)
	return rankRes
}

func (writer *Writer) GetRankAndMembersDescFromSortedSet(mainKey string) []sortedsethandler.ScoreKey {
	rankRes := writer.SortedSet.GetRankAndMembersDesc(mainKey)
	return rankRes
}
