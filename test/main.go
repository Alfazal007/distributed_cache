package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	mu := sync.Mutex{}
	cond := sync.NewCond(&mu)

	var data int
	version := 0

	// Producer
	go func() {
		for i := 1; i <= 5; i++ {
			time.Sleep(time.Second)
			mu.Lock()
			data = i
			version++ // new data version
			fmt.Println("Produced:", i)
			cond.Broadcast()
			mu.Unlock()
		}
	}()

	// Consumer function
	consumer := func(id int) {
		lastSeen := 0
		for {
			mu.Lock()
			for lastSeen == version { // wait for new version
				cond.Wait()
			}
			fmt.Printf("Consumer %d got: %d\n", id, data)
			lastSeen = version
			mu.Unlock()
			time.Sleep(500 * time.Millisecond)
		}
	}

	go consumer(1)
	go consumer(2)

	time.Sleep(10 * time.Second)
}
