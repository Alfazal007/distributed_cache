package main

import (
	"fmt"
	"github.com/bits-and-blooms/bloom/v3"
)

func main() {
	// Create Bloom filter with 1000 elements and 0.01 false positive probability
	bf := bloom.NewWithEstimates(1000, 0.01)

	// Add some elements
	bf.Add([]byte("alice"))
	bf.Add([]byte("bob"))

	// Check membership
	fmt.Println(bf.Test([]byte("alice"))) // true
	fmt.Println(bf.Test([]byte("carol"))) // probably false
	fmt.Println(bf.Test([]byte("bob")))
}
