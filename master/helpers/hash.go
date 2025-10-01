package helpers

import "hash/fnv"

func HashStringToRange(s string, n uint32) uint32 {
	h := fnv.New32a()
	h.Write([]byte(s))
	hashValue := h.Sum32()
	return hashValue % n
}
