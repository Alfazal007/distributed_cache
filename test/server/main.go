package main

import (
	"fmt"
	"net"
	"os"
)

func main() {
	listener, err := net.Listen("tcp", ":8080")
	if err != nil {
		fmt.Println("Error starting server:", err)
		os.Exit(1)
	}
	defer listener.Close()
	fmt.Println("Server listening on port 8080...")
	for {
		conn, err := listener.Accept()
		if err != nil {
			fmt.Println("Error accepting connection:", err)
			continue
		}
		fmt.Println("New client connected:", conn.RemoteAddr())
		go handleConnection(conn)
	}
}

func handleConnection(conn net.Conn) {
	defer conn.Close()
	toBeWritten := "shanks"
	i := 0
	for i < 10 {
		_, err := conn.Write([]byte("Echo: " + toBeWritten + "\n"))
		if err != nil {
			fmt.Println("Error writing to client:", err)
			return
		}
		i += 1
	}
}
