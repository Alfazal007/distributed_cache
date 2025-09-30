package main

import (
	"fmt"
	"log"
	"masterServer/helpers"
	"net"

	pb "masterServer/proto"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func main() {
	conn, err := grpc.NewClient("localhost:8000", grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		log.Fatalf("did not connect: %v", err)
	}
	defer conn.Close()
	go ConnectTcpSocket()
	listener, err := net.Listen("tcp", ":8002")
	if err != nil {
		fmt.Printf("Failed to start listener: %v\n", err)
		return
	}
	defer listener.Close()

	fmt.Println("Master listening on :8002")
	client := pb.NewCacheInteractClient(conn)
	for {
		conn, err := listener.Accept()
		if err != nil {
			fmt.Printf("Accept error: %v\n", err)
			continue
		}
		go handleConn(conn, client)
	}
}

func handleConn(conn net.Conn, grpcClient pb.CacheInteractClient) {
	defer conn.Close()
	handleConnectionForGrpc(conn, grpcClient)
}

func ConnectTcpSocket() {
	conn, err := net.Dial("tcp", "localhost:8001")
	if err != nil {
		fmt.Printf("Failed to connect: %v\n", err)
		return
	}
	defer conn.Close()
	go helpers.PingPongExchange(conn)
	go HandleConnectionInputAndChannelExchange(conn)
	for {
	}
}
