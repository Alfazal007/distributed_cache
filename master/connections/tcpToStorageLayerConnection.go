package connections

import (
	"masterServer/helpers"
	"masterServer/types"
	"net"
)

// Does pingpong management to keep connection alive between master and storage tcp connection
func ConnectTcpSocketStorageServer(link string, conn net.Conn, clientChannels types.ClientChannelsData) {
	go helpers.PingPongExchange(conn)
	go MessageFromStorageToMasterOverTcpHandler(conn, clientChannels)
}
