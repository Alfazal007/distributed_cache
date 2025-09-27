package server

import (
	"cacheServer/proto"
	"context"
)

func (server *Server) MapDelete(ctx context.Context, input *proto.MapDeleteInput) (*proto.MapDeleteResult, error) {
	success := server.Writer.DeleteValueFromHashMap(input.Key)
	if success {
		return &proto.MapDeleteResult{
			Result: 1,
		}, nil
	}
	return &proto.MapDeleteResult{
		Result: -1,
	}, nil
}
