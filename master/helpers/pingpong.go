package helpers

import (
	"encoding/json"
	"masterServer/types"
	"net"
	"time"
)

// Send ping from master to storage unit
func PingPongExchange(conn net.Conn) {
	for {
		time.Sleep(5 * time.Second)
		pingMessage := types.Message{
			MessageType:     types.PING,
			Key:             "pingpongexchange",
			ShouldSubscribe: false,
		}
		jsonMessage, _ := json.Marshal(pingMessage)
		jsonMessage = append(jsonMessage, byte('\n'))
		conn.Write(jsonMessage)
	}
}
