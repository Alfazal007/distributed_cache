package server

import (
	"cacheServer/proto"
	"context"
)

func (server *Server) MapFetch(ctx context.Context, input *proto.MapFetchInput) (*proto.MapFetchResult, error) {
	value := server.Writer.GetValueFromHashMap(input.Key)
	if value == nil {
		return &proto.MapFetchResult{
			Value: "",
		}, nil
	}
	return &proto.MapFetchResult{
		Value: string(value),
	}, nil
}
