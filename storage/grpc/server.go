package server

import (
	datahandler "cacheServer/dataHandler"
	"cacheServer/proto"
)

type Server struct {
	proto.UnimplementedCacheInteractServer
	Writer datahandler.Writer
}
