package server

import (
	"cacheServer/proto"
)

type Server struct {
	proto.UnimplementedCacheInteractServer
}
