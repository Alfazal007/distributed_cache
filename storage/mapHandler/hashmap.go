package maphandler

import (
	"cacheServer/config"
	"time"
)

type Value struct {
	value          []byte
	expired_in     int64
	frequency_used int64
}

type Map struct {
	Name map[string]Value
}

// Make sure before calling this, you update the current size and make sure
// the current size plus added value size is less than total allowed size
// returns 2 values, first is prevLength and the next is new length
func (hashmap *Map) Insert(key string, value []byte) (int, int) {
	var prevLength, newLength int
	prevData, ok := hashmap.Name[key]
	newLength = len(key) + len(value) + 8 + 8
	if !ok {
		prevLength = 0
	} else {
		prevLength = len(key) + len(prevData.value) + 8 + 8
	}
	now := time.Now()
	future := now.Add(24 * time.Hour).Unix()
	hashmap.Name[key] = Value{
		value:          value,
		expired_in:     future,
		frequency_used: 1,
	}
	return prevLength, newLength
}

// Returns value if it exists along with a boolean indicating if the value is existing or not
func (hashmap *Map) Get(key string) ([]byte, bool) {
	data, ok := hashmap.Name[key]
	if ok {
		now := time.Now()
		if data.expired_in <= now.Unix() {
			delete(hashmap.Name, key)
			return nil, false
		}
		future := now.Add(24 * time.Hour).Unix()
		data.expired_in = future
		data.frequency_used += 1
		hashmap.Name[key] = data
		return data.value, true
	} else {
		return nil, false
	}
}

// Returns boolean indicating whether to update the current size or not
func (hashmap *Map) Delete(key string) (bool, int) {
	data, ok := hashmap.Name[key]
	if !ok {
		return false, 0
	}
	delete(hashmap.Name, key)
	sizeDeleted := len(key) + len(data.value) + 8 + 8
	return true, sizeDeleted
}

// Deletes the data which was used earliest(with the earliest expiry time)
func (hashmap *Map) LruDelete() {
	if config.CURRENTSIZE*2 < config.TOTALSIZE {
		return
	}
	var keyToBeDeleted string
	var valueToBeDeleted Value
	found := false
	for key, value := range hashmap.Name {
		if !found {
			found = true
			keyToBeDeleted = key
			valueToBeDeleted = value
		} else {
			if value.expired_in < hashmap.Name[keyToBeDeleted].expired_in {
				keyToBeDeleted = key
				valueToBeDeleted = value
			}
		}
	}
	sizeDeleted := len(keyToBeDeleted) + len(valueToBeDeleted.value) + 8 + 8
	config.CURRENTSIZE -= sizeDeleted
	delete(hashmap.Name, keyToBeDeleted)
}

// Deletes the data which has the lowest frequency
func (hashmap *Map) LfuDelete() {
	if config.CURRENTSIZE*2 < config.TOTALSIZE {
		return
	}
	var keyToBeDeleted string
	var valueToBeDeleted Value
	found := false
	for key, value := range hashmap.Name {
		if !found {
			found = true
			keyToBeDeleted = key
			valueToBeDeleted = value
		} else {
			if value.frequency_used < hashmap.Name[keyToBeDeleted].frequency_used {
				keyToBeDeleted = key
				valueToBeDeleted = value
			}
		}
	}
	sizeDeleted := len(keyToBeDeleted) + len(valueToBeDeleted.value) + 8 + 8
	config.CURRENTSIZE -= sizeDeleted
	delete(hashmap.Name, keyToBeDeleted)
}

// Deletes from a sample of 5 and repeats until sample does not have minimum keys to be deleted
func (hashmap *Map) SamplingDelete() {
	loop := true
	var sizeDeleted = 0
	for loop {
		count := 0
		keysToBeDeleted := []string{}
		for key, value := range hashmap.Name {
			if value.expired_in <= time.Now().Unix() {
				keysToBeDeleted = append(keysToBeDeleted, key)
			}
			count++
			if count >= 5 {
				break
			}
		}
		if len(keysToBeDeleted) < 3 {
			loop = false
		}
		for _, key := range keysToBeDeleted {
			value := hashmap.Name[key]
			sizeDeleted += len(key) + 8 + 8 + len(value.value)
			delete(hashmap.Name, key)
		}
	}
	config.CURRENTSIZE -= sizeDeleted
}
