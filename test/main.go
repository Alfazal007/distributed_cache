package main

import (
	"fmt"

	"github.com/ryszard/goskiplist/skiplist"
)

// ScoreKey is the element we put into the skiplist
type ScoreKey struct {
	Score int64
	Name  string
}

// comparator for skiplist
func ScoreKeyComparator(a, b interface{}) bool {
	ka := a.(ScoreKey)
	kb := b.(ScoreKey)
	if ka.Score == kb.Score {
		return ka.Name < kb.Name
	}
	return ka.Score < kb.Score
}

type SortedSet struct {
	skiplist    *skiplist.SkipList
	nameToScore map[string]int64
}

func NewSortedSet() *SortedSet {
	return &SortedSet{
		skiplist:    skiplist.NewCustomMap(ScoreKeyComparator),
		nameToScore: make(map[string]int64),
	}
}

// Insert inserts or updates a member
func (s *SortedSet) Insert(name string, score int64) {
	if oldScore, ok := s.nameToScore[name]; ok {
		s.skiplist.Delete(ScoreKey{Score: oldScore, Name: name})
	}
	s.nameToScore[name] = score
	s.skiplist.Set(ScoreKey{Score: score, Name: name}, nil)
}

// GetScore returns the score of a member, or -1 if not found
func (s *SortedSet) GetScore(name string) int64 {
	if score, ok := s.nameToScore[name]; ok {
		return score
	}
	return -1
}

// GetRank returns the 1-based rank of a member, or -1 if not found
func (s *SortedSet) GetRank(name string) int {
	if _, ok := s.nameToScore[name]; !ok {
		return -1
	}
	rank := 1
	for iter := s.skiplist.Iterator(); iter.Next(); {
		key := iter.Key().(ScoreKey)
		if key.Name == name {
			return rank
		}
		rank++
	}
	return -1
}

// GetAsc returns all members in ascending order
func (s *SortedSet) GetAsc() []ScoreKey {
	res := []ScoreKey{}
	for iter := s.skiplist.Iterator(); iter.Next(); {
		key := iter.Key().(ScoreKey)
		res = append(res, key)
	}
	return res
}

// Example usage
func main() {
	ss := NewSortedSet()
	ss.Insert("alice", 30)
	ss.Insert("bob", 10)
	ss.Insert("carol", 20)
	fmt.Println("Score of bob:", ss.GetScore("bob"))
	fmt.Println("Rank of bob:", ss.GetRank("bob"))
	fmt.Println("All asc:", ss.GetAsc())
}

