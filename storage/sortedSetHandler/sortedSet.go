package sortedsethandler

import (
	"github.com/ryszard/goskiplist/skiplist"
)

func ScoreKeyComparator(a, b any) bool {
	keyA := a.(ScoreKey)
	keyB := b.(ScoreKey)
	if keyA.Score == keyB.Score {
		return keyA.Name < keyB.Name
	}
	return keyA.Score < keyB.Score
}

type ScoreKey struct {
	Score int64
	Name  string
}

type SortedSetStructInternal struct {
	SkipList    *skiplist.SkipList
	NameToScore map[string]int64
}

type SortedSetStruct struct {
	SortedSet map[string]SortedSetStructInternal
}

// Returns the size to be added to the final config size variable
func (sortedSet *SortedSetStruct) InsertToSet(key string, value int64, mainKey string) int {
	_, ok := sortedSet.SortedSet[mainKey]
	if !ok {
		sortedSet.SortedSet[mainKey] = SortedSetStructInternal{
			SkipList:    skiplist.NewCustomMap(ScoreKeyComparator),
			NameToScore: make(map[string]int64),
		}
	}
	oldScore, ok := sortedSet.SortedSet[mainKey].NameToScore[key]
	needToAdd := true
	if ok {
		needToAdd = false
		sortedSet.SortedSet[mainKey].SkipList.Delete(ScoreKey{oldScore, key})
	}
	sortedSet.SortedSet[mainKey].NameToScore[key] = value
	sortedSet.SortedSet[mainKey].SkipList.Set(ScoreKey{value, key}, nil)
	if needToAdd {
		return len(key) + len(key) + 8 + 8
	}
	return 0
}

// Returns the size to be decreased from the final config size variable
func (sortedSet *SortedSetStruct) RemoveFromSet(key, mainKey string) int {
	_, ok := sortedSet.SortedSet[mainKey]
	if !ok {
		return 0
	}
	data, ok := sortedSet.SortedSet[mainKey].NameToScore[key]
	if !ok {
		return 0
	}
	sortedSet.SortedSet[mainKey].SkipList.Delete(ScoreKey{data, key})
	delete(sortedSet.SortedSet[mainKey].NameToScore, key)
	return len(key) + len(key) + 8 + 8
}

// Returns the score of the data if it exists else returns -1
func (sortedSet *SortedSetStruct) GetScore(key, mainKey string) int64 {
	_, ok := sortedSet.SortedSet[mainKey]
	if !ok {
		return 0
	}
	data, ok := sortedSet.SortedSet[mainKey].NameToScore[key]
	if !ok {
		return -1
	}
	return data
}

// Returns the rank of a key else returns -1
func (sortedSet *SortedSetStruct) GetRank(target, mainKey string) int32 {
	_, ok := sortedSet.SortedSet[mainKey]
	if !ok {
		return 0
	}
	_, ok = sortedSet.SortedSet[mainKey].NameToScore[target]
	if !ok {
		return -1
	}
	rank := 1
	for iter := sortedSet.SortedSet[mainKey].SkipList.Iterator(); iter.Next(); {
		key := iter.Key().(ScoreKey)
		if key.Name == target {
			return int32(rank)
		}
		rank++
	}
	return -1
}

// Returns the members of sorted list in asc order
func (sortedSet *SortedSetStruct) GetRankAndMembersAsc(mainKey string) []ScoreKey {
	_, ok := sortedSet.SortedSet[mainKey]
	if !ok {
		return nil
	}
	res := []ScoreKey{}
	for iter := sortedSet.SortedSet[mainKey].SkipList.Iterator(); iter.Next(); {
		key := iter.Key().(ScoreKey)
		res = append(res, ScoreKey{Name: key.Name, Score: key.Score})
	}
	return res
}

// Returns the members of sorted list in desc order
func (sortedSet *SortedSetStruct) GetRankAndMembersDesc(mainKey string) []ScoreKey {
	_, ok := sortedSet.SortedSet[mainKey]
	if !ok {
		return nil
	}
	res := []ScoreKey{}
	for iter := sortedSet.SortedSet[mainKey].SkipList.Iterator(); iter.Next(); {
		key := iter.Key().(ScoreKey)
		res = append(res, ScoreKey{Name: key.Name, Score: key.Score})
	}
	for i, j := 0, len(res)-1; i < j; i, j = i+1, j-1 {
		res[i], res[j] = res[j], res[i]
	}
	return res
}
