package connections

import (
	"net"

	"masterServer/grpc"
	pb "masterServer/proto"
)

func HandleConnGrpc(conn net.Conn, grpcClients []pb.CacheInteractClient) {
	defer conn.Close()
	grpc.HandleConnectionForGrpc(conn, grpcClients)
}
