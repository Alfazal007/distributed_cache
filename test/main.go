package main

import (
	"fmt"
	"github.com/axiomhq/hyperloglog"
)

func main() {
	h := hyperloglog.New()
	h.Insert([]byte("user1"))
	h.Insert([]byte("user2"))
	h.Insert([]byte("user3"))
	h.Insert([]byte("user2"))
	h.Insert([]byte("user4"))
	fmt.Println("Approximate count:", h.Estimate())
}
