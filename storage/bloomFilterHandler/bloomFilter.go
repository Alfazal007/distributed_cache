package bloomfilterhandler

import (
	"github.com/bits-and-blooms/bloom/v3"
)

type BloomFilterHander struct {
	bloomFilter map[string]*bloom.BloomFilter
}

func (bfHandler *BloomFilterHander) InsertToBF(key string, value []byte) int {
	_, ok := bfHandler.bloomFilter[key]
	sizeToReturn := 0
	if !ok {
		bfHandler.bloomFilter[key] = bloom.NewWithEstimates(1000, 0.01)
		sizeToReturn = 1200
	}
	bfHandler.bloomFilter[key].Add(value)
	return sizeToReturn
}

func (bfHandler *BloomFilterHander) Exists(key string, value []byte) bool {
	_, ok := bfHandler.bloomFilter[key]
	if !ok {
		return false
	}
	exists := bfHandler.bloomFilter[key].Test(value) // if true => maybe exists in bf, if false def does not exist in bf
	return exists
}
