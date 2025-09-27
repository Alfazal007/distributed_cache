package maps

import "time"

type Value struct {
	value      string
	expired_in int64
}

type Map struct {
	name map[string]Value
}

// Make sure before calling this, you update the current size and make sure
// the current size plus added value size is less than total allowed size
func (hashmap *Map) Insert(key, value string) {
	now := time.Now()
	future := now.Add(24 * time.Hour).Unix()
	hashmap.name[key] = Value{
		value:      value,
		expired_in: future,
	}
}

// Returns value if it exists along with a boolean indicating if the value is existing or not
func (hashmap *Map) Get(key string) (string, bool) {
	data, ok := hashmap.name[key]
	if ok {
		now := time.Now()
		future := now.Add(24 * time.Hour).Unix()
		data.expired_in = future
		hashmap.name[key] = data
		return data.value, true
	} else {
		return "", false
	}
}

// Returns boolean indicating whether to update the current size or not
func (hashmap *Map) Delete(key string) bool {
	_, ok := hashmap.name[key]
	if !ok {
		return false
	}
	delete(hashmap.name, key)
	return true
}
