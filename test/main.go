package main

import (
	"fmt"
	"github.com/ryszard/goskiplist/skiplist"
)

// ScoreKey is a composite key: first by score, then by name
type ScoreKey struct {
	Score int
	Name  string
}

// Comparator: ascending by score, then by name
func scoreKeyComparator(a, b any) bool {
	keyA := a.(ScoreKey)
	keyB := b.(ScoreKey)
	if keyA.Score == keyB.Score {
		return keyA.Name < keyB.Name
	}
	return keyA.Score < keyB.Score
}

func main() {
	sl := skiplist.NewCustomMap(scoreKeyComparator)

	// Insert leaderboard entries
	sl.Set(ScoreKey{100, "Alice"}, nil)
	sl.Set(ScoreKey{200, "Bob"}, nil)
	sl.Set(ScoreKey{150, "Charlie"}, nil)
	sl.Set(ScoreKey{100, "David"}, nil)
	sl.Set(ScoreKey{200, "Eve"}, nil)

	// Ascending order
	fmt.Println("Leaderboard (ascending):")
	for iter := sl.Iterator(); iter.Next(); {
		key := iter.Key().(ScoreKey)
		fmt.Printf("%s => %d\n", key.Name, key.Score)
	}

	// Descending order: collect into slice, then print in reverse
	fmt.Println("\nLeaderboard (descending):")
	var keys []ScoreKey
	for iter := sl.Iterator(); iter.Next(); {
		keys = append(keys, iter.Key().(ScoreKey))
	}
	for i := len(keys) - 1; i >= 0; i-- {
		fmt.Printf("%s => %d\n", keys[i].Name, keys[i].Score)
	}
}
