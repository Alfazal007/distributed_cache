package datahandler

import (
	"cacheServer/config"
	maphandler "cacheServer/mapHandler"
	queuehandler "cacheServer/queueHandler"
)

type Writer struct {
	HashMap maphandler.Map
	Queue   queuehandler.Queue
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
