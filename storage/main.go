package main

import (
	"cacheServer/grpc"
	"cacheServer/proto"
	"log"
	"net"

	"google.golang.org/grpc"
)

func main() {
	s := grpc.NewServer()
	proto.RegisterCacheInteractServer(s, &server.Server{})
	listener, err := net.Listen("tcp", ":8000")
	if err != nil {
		log.Fatal("There was an error with the server setup ", err)
	}
	s.Serve(listener)
}
