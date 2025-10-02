package main

import (
	"fmt"
	"log"
	"masterServer/config"
	"masterServer/connections"
	"masterServer/types"
	"net"
	"sync"

	pb "masterServer/proto"

	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

func main() {
	grpcClients := make([]pb.CacheInteractClient, 0)
	tcpClientsToStorage := make([]net.Conn, 0)
	clientChannels := &types.ConnectedClients{
		InternalData: make([]types.InternalClientData, 0),
	}

	for _, host := range config.StorageNodes {
		grpcLink := fmt.Sprintf("%v:8000", host)
		tcpLink := fmt.Sprintf("%v:8001", host)
		tcpConn, err := net.Dial("tcp", tcpLink)
		if err != nil {
			fmt.Printf("Failed to connect: %v\n", err)
			return
		}
		defer tcpConn.Close()
		tcpClientsToStorage = append(tcpClientsToStorage, tcpConn)
		go connections.ConnectTcpSocketStorageServer(tcpLink, tcpConn, clientChannels)
		conn, err := grpc.NewClient(grpcLink, grpc.WithTransportCredentials(insecure.NewCredentials()))
		if err != nil {
			log.Fatalf("did not connect: %v", err)
		}
		defer conn.Close()
		client := pb.NewCacheInteractClient(conn)
		grpcClients = append(grpcClients, client)
	}

	wg := sync.WaitGroup{}
	wg.Add(2)

	// This is for grpc listener
	go func() {
		listener, err := net.Listen("tcp", ":8002")
		if err != nil {
			fmt.Printf("Failed to start listener: %v\n", err)
			return
		}
		defer listener.Close()
		defer wg.Done()
		fmt.Println("Master listening for grpc on :8002")
		for {
			conn, err := listener.Accept()
			if err != nil {
				fmt.Printf("Accept error: %v\n", err)
				continue
			}
			go connections.HandleConnGrpc(conn, grpcClients)
		}
	}()

	// This is for tcp listener
	go func() {
		listener, err := net.Listen("tcp", ":8003")
		if err != nil {
			fmt.Printf("Failed to start listener: %v\n", err)
			return
		}
		defer listener.Close()
		defer wg.Done()
		fmt.Println("Master listening on for tcp connections :8003")
		for {
			conn, err := listener.Accept()
			if err != nil {
				fmt.Printf("Accept error: %v\n", err)
				continue
			}
			clientId := clientChannels.InsertClient(conn)
			go connections.HandleConnClientTcp(conn, clientId, clientChannels, tcpClientsToStorage)
		}
	}()
	wg.Wait()
}
