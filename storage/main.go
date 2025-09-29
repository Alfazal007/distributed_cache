package main

import (
	datahandler "cacheServer/dataHandler"
	"cacheServer/grpc"
	hyperlogloghandler "cacheServer/hyperloglogHandler"
	maphandler "cacheServer/mapHandler"
	"cacheServer/proto"
	queuehandler "cacheServer/queueHandler"
	sethandler "cacheServer/setHandler"
	sortedsethandler "cacheServer/sortedSetHandler"
	streamhandler "cacheServer/streamHandler"
	"log"
	"net"
	"time"

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
	}
	proto.RegisterCacheInteractServer(s, &server.Server{
		Writer: writer,
	})
	listener, err := net.Listen("tcp", ":8000")
	if err != nil {
		log.Fatal("There was an error with the server setup ", err)
	}
	go StartDeletion(&writer)
	s.Serve(listener)
}

func StartDeletion(writer *datahandler.Writer) {
	for {
		time.Sleep(10 * time.Second)
		writer.FreeUpSpace()
	}
}
