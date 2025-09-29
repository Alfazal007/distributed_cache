package main

import (
	"bufio"
	bloomfilterhandler "cacheServer/bloomFilterHandler"
	datahandler "cacheServer/dataHandler"
	"cacheServer/grpc"
	hyperlogloghandler "cacheServer/hyperloglogHandler"
	maphandler "cacheServer/mapHandler"
	"cacheServer/proto"
	queuehandler "cacheServer/queueHandler"
	sethandler "cacheServer/setHandler"
	sortedsethandler "cacheServer/sortedSetHandler"
	streamhandler "cacheServer/streamHandler"
	"encoding/json"
	"fmt"
	"log"
	"net"
	"sync"
	"time"

	"github.com/bits-and-blooms/bloom/v3"

	"github.com/axiomhq/hyperloglog"
	"google.golang.org/grpc"
)

func main() {
	s := grpc.NewServer()
	writer := datahandler.Writer{
		HashMap: maphandler.Map{
			Name: make(map[string]maphandler.Value),
		},
		Queue: queuehandler.Queue{
			Name: make(map[string][]queuehandler.Value),
		},
		Set: sethandler.SetData{
			Name: make(map[string]sethandler.Set),
		},
		SortedSet: sortedsethandler.SortedSetStruct{
			SortedSet: make(map[string]sortedsethandler.SortedSetStructInternal),
		},
		Stream: streamhandler.StreamHandler{
			Data: make(map[string][]streamhandler.StreamData),
		},
		HyperLogLog: hyperlogloghandler.HyperLogLogStruct{
			Hyperloglog: make(map[string]*hyperloglog.Sketch),
		},
		BloomFilter: bloomfilterhandler.BloomFilterHander{
			BloomFilter: make(map[string]*bloom.BloomFilter),
		},
	}
	proto.RegisterCacheInteractServer(s, &server.Server{
		Writer: writer,
	})
	listener, err := net.Listen("tcp", ":8000")
	if err != nil {
		log.Fatal("There was an error with the server setup ", err)
	}
	go StartDeletion(&writer)
	go SecondServer()
	s.Serve(listener)
}

func StartDeletion(writer *datahandler.Writer) {
	for {
		time.Sleep(10 * time.Second)
		writer.FreeUpSpace()
	}
}

func SecondServer() {
	listener, err := net.Listen("tcp", ":8001")
	if err != nil {
		fmt.Println("Error starting server:", err)
		return
	}
	defer listener.Close()
	fmt.Println("Server listening on port 8001...")
	masterConnected := MasterConnected{
		MasterConnected: false,
		RwLock:          sync.RWMutex{},
	}
	for {
		conn, err := listener.Accept()
		masterConnected.RwLock.RLock()
		masterConnectedBool := masterConnected.MasterConnected
		masterConnected.RwLock.RUnlock()
		if masterConnectedBool {
			fmt.Println("Master already connected, only one connection allowed")
			conn.Close()
			continue
		}
		masterConnected.RwLock.Lock()
		masterConnected.MasterConnected = true
		masterConnected.RwLock.Unlock()
		if err != nil {
			fmt.Println("Error accepting connection:", err)
			continue
		}
		go handleConnection(conn, &masterConnected)
	}
}

func handleConnection(conn net.Conn, masterConnected *MasterConnected) {
	defer func() {
		conn.Close()
		masterConnected.RwLock.Lock()
		masterConnected.MasterConnected = false
		masterConnected.RwLock.Unlock()
	}()
	scanner := bufio.NewScanner(conn)
	for scanner.Scan() {
		line := scanner.Text()
		var message Message
		err := json.Unmarshal([]byte(line), &message)
		if err != nil || message.Key == "" {
			fmt.Println("Invalid message(READING MESSAGE AGAIN): ", err)
			continue
		}
		switch message.MessageType {
		case QUEUE:
		case STREAM:
		case SUBSCRIBER:
		}
	}
	if err := scanner.Err(); err != nil {
		fmt.Println("Connection error:", err)
	}
	fmt.Println("Client disconnected:", conn.RemoteAddr())
}
