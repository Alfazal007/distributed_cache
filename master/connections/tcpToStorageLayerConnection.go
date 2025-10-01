package connections

import (
	"masterServer/helpers"
	"net"
)

// Does pingpong management to keep connection alive between master and storage tcp connection
func ConnectTcpSocketStorageServer(link string, tcpClientsToStorage []net.Conn, conn net.Conn) {
	go helpers.PingPongExchange(conn)
	go MessageFromStorageToMasterOverTcpHandler(conn)
}
