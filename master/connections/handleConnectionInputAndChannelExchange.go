package connections

import (
	"bufio"
	"fmt"
	"net"
)

// The data that comes in here is coming as responses from storage unit, it can return pong msgs as well as subscription responses
// Message from storage unit to master listener
func MessageFromStorageToMasterOverTcpHandler(conn net.Conn) {
	scanner := bufio.NewScanner(conn)
	for scanner.Scan() {
		line := scanner.Text()
		fmt.Println("data came in from somewhere")
		fmt.Println(line)
		// TODO:: accepts TCP incoming messages from storage unit (as responses) and forward to proper client
	}
}
