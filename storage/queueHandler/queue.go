package queuehandler

type Value struct {
	value []byte
}

type Queue struct {
	Name map[string][]Value
}

// This adds data to at the 0th index of the queue, and returns the size inserted
func (queue *Queue) InsertFront(key string, value []byte) int {
	prevData, ok := queue.Name[key]
	if !ok {
		var newData []Value
		newData = append(newData, Value{value: value})
		queue.Name[key] = newData
	} else {
		prevData = append([]Value{{
			value: value,
		}}, prevData...)
		queue.Name[key] = prevData
	}
	return len(value)
}

// This adds data to at the last index of the queue, and returns the size inserted
func (queue *Queue) InsertBack(key string, value []byte) int {
	prevData, ok := queue.Name[key]
	if !ok {
		var newData []Value
		newData = append(newData, Value{value: value})
		queue.Name[key] = newData
	} else {
		prevData = append(prevData, Value{value: value})
		queue.Name[key] = prevData
	}
	return len(value)
}

// This removes the data from the front of the queue, returns the data and the length to be subtracted
func (queue *Queue) RemoveFront(key string) ([]byte, int) {
	prevData, ok := queue.Name[key]
	if !ok || len(prevData) < 1 {
		return nil, 0
	} else {
		value := prevData[0]
		prevData = prevData[1:]
		queue.Name[key] = prevData
		return value.value, len(value.value)
	}
}

// This removes the data from the back of the queue, returns the data and the length to be subtracted
func (queue *Queue) RemoveBack(key string) ([]byte, int) {
	prevData, ok := queue.Name[key]
	if !ok || len(prevData) < 1 {
		return nil, 0
	} else {
		value := prevData[len(prevData)-1]
		prevData = prevData[:len(prevData)-1]
		queue.Name[key] = prevData
		return value.value, len(value.value)
	}
}
