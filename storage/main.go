package main

import (
	datahandler "cacheServer/dataHandler"
	"cacheServer/grpc"
	maphandler "cacheServer/mapHandler"
	"cacheServer/proto"
	"log"
	"net"

	"google.golang.org/grpc"
)

func main() {
	s := grpc.NewServer()
	writer := datahandler.Writer{
		HashMap: maphandler.Map{
			Name: make(map[string]maphandler.Value),
		},
	}
	proto.RegisterCacheInteractServer(s, &server.Server{
		Writer: writer,
	})
	listener, err := net.Listen("tcp", ":8000")
	if err != nil {
		log.Fatal("There was an error with the server setup ", err)
	}
	s.Serve(listener)
}
