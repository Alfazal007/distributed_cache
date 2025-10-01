package connections

import (
	"bufio"
	"encoding/json"
	"fmt"
	"masterServer/helpers"
	"masterServer/types"
	"net"
)

func HandleConnClientTcp(conn net.Conn, clientId string, connectedClients *types.ConnectedClients, tcpConnToStorage []net.Conn) {
	defer conn.Close()
	defer connectedClients.RemoveClient(clientId)
	scanner := bufio.NewScanner(conn)
	for scanner.Scan() {
		line := scanner.Text()
		var clientMessage types.Message
		if err := json.Unmarshal([]byte(line), &clientMessage); err != nil {
			fmt.Printf("invalid message %v\n", err)
			continue
		}
		if clientMessage.MessageType != types.PING {
			index := helpers.HashStringToRange(clientMessage.Key, uint32(len(tcpConnToStorage)))
			connToWrite := tcpConnToStorage[index]
			jsonMessage, _ := json.Marshal(clientMessage)
			jsonMessage = append(jsonMessage, byte('\n'))
			connToWrite.Write(jsonMessage)
			connectedClients.AddSubscription(clientId, clientMessage.Key, clientMessage.MessageType)
		}
	}
}
