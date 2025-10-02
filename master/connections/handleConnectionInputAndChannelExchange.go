package connections

import (
	"bufio"
	"encoding/json"
	"fmt"
	"masterServer/types"
	"net"
)

// The data that comes in here is coming as responses from storage unit, it can return pong msgs as well as subscription responses
// Message from storage unit to master listener
func MessageFromStorageToMasterOverTcpHandler(conn net.Conn, clientChannels *types.ConnectedClients) {
	scanner := bufio.NewScanner(conn)
	for scanner.Scan() {
		line := scanner.Text()
		if line == "PONG" {
			continue
		}
		var storageMessage types.IncomingDataFromStorageToTcp
		if err := json.Unmarshal([]byte(line), &storageMessage); err != nil {
			fmt.Printf("invalid message %v\n", err)
			continue
		}
		clientChannels.SendMessageToAllClients(storageMessage.Key, storageMessage.MessageType, storageMessage.Value)
	}
}
