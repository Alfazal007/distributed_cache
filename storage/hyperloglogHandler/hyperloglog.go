package hyperlogloghandler

import (
	"github.com/axiomhq/hyperloglog"
)

type HyperLogLogStruct struct {
	Hyperloglog map[string]*hyperloglog.Sketch
}

func (hll *HyperLogLogStruct) HasKey(key string) bool {
	_, ok := hll.Hyperloglog[key]
	if !ok {
		return false
	}
	return true
}

// Inserts the value to the hll and returns the size to be added to config.CURRENTSIZE
func (hll *HyperLogLogStruct) InsertData(key string, value []byte) int64 {
	_, ok := hll.Hyperloglog[key]
	addedSize := 0
	if !ok {
		addedSize += 65536
		hll.Hyperloglog[key] = hyperloglog.New16()
	}
	hll.Hyperloglog[key].Insert(value)
	return int64(addedSize)
}

// Returns the count estimate of the total number of unique keys
func (hll *HyperLogLogStruct) ReturnCount(key string) int {
	_, ok := hll.Hyperloglog[key]
	if !ok {
		return 0
	}
	return int(hll.Hyperloglog[key].Estimate())
}

// Combine 2 hlls and returns -1 on error and on not found and actual value otherwise, returns the count and size to be added
func (hll *HyperLogLogStruct) CombineHll(key1, key2, dest string) (int, int) {
	_, ok := hll.Hyperloglog[dest]
	if ok {
		return -1, 0
	}
	_, ok = hll.Hyperloglog[key1]
	if !ok {
		return -1, 0
	}
	_, ok = hll.Hyperloglog[key2]
	if !ok {
		return -1, 0
	}
	destinationHll := hll.Hyperloglog[key1].Clone()
	hll.Hyperloglog[dest] = destinationHll
	err := hll.Hyperloglog[dest].Merge(hll.Hyperloglog[key2])
	if err != nil {
		return -1, 0
	}
	return int(hll.Hyperloglog[dest].Estimate()), 65536
}
