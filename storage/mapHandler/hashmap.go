package maphandler

import "time"

type Value struct {
	value      []byte
	expired_in int64
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
	newLength = 16 + len(key) + len(value)
	if !ok {
		prevLength = 0
	} else {
		prevLength = 16 + len(key) + len(prevData.value)
	}
	now := time.Now()
	future := now.Add(24 * time.Hour).Unix()
	hashmap.Name[key] = Value{
		value:      value,
		expired_in: future,
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
		hashmap.Name[key] = data
		return data.value, true
	} else {
		return nil, false
	}
}

// Returns boolean indicating whether to update the current size or not
func (hashmap *Map) Delete(key string) bool {
	_, ok := hashmap.Name[key]
	if !ok {
		return false
	}
	delete(hashmap.Name, key)
	return true
}
