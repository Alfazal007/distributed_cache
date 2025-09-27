package server

import (
	"cacheServer/proto"
	"context"
)

func (server *Server) MapInsert(ctx context.Context, input *proto.MapInsertInput) (*proto.MapInsertResult, error) {
	success := server.Writer.WriteToHashMap(input.Key, []byte(input.Value))
	if !success {
		return &proto.MapInsertResult{
			Result: -1,
		}, nil
	}
	return &proto.MapInsertResult{
		Result: 1,
	}, nil
}
