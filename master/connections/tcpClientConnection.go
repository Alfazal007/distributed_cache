package connections

import (
	"bufio"
	"fmt"
	"net"
)

func HandleConnClientTcp(conn net.Conn) {
	defer conn.Close()
	scanner := bufio.NewScanner(conn)
	// TODO:: accepts TCP incoming messages from client and forward it to storage unit
	for scanner.Scan() {
		line := scanner.Text()
		fmt.Println(line)
	}
}
