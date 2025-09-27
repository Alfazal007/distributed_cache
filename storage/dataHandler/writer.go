package datahandler

import (
	"cacheServer/config"
	maphandler "cacheServer/mapHandler"
)

type Writer struct {
	HashMap maphandler.Map
}

func (writer *Writer) WriteToHashMap(key string, value []byte) bool {
	lengthToBeAdded := config.CURRENTSIZE + 16 + len(key) + len(value)
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
	success := writer.HashMap.Delete(key)
	return success
}
