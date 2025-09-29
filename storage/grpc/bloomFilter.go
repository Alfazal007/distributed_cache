package server

import (
	"cacheServer/proto"
	"context"
)

func (server *Server) InsertToBf(ctx context.Context, input *proto.InsertToBfInput) (*proto.InsertToBfOutput, error) {
	server.Writer.AddToBf(input.Key, input.Value)
	return &proto.InsertToBfOutput{
		Success: true,
	}, nil
}

func (server *Server) ExistsInBf(ctx context.Context, input *proto.ExistsInBfInput) (*proto.ExistsInBfOutput, error) {
	exists := server.Writer.ExistsInBf(input.Key, input.Value)
	return &proto.ExistsInBfOutput{
		Exists: exists,
	}, nil
}
