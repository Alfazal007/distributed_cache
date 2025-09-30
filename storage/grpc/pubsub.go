package server

import (
	"cacheServer/proto"
	"context"
)

func (server *Server) PublishMessage(ctx context.Context, input *proto.PublishMessageInput) (*proto.PublishMessageOutput, error) {
	server.Writer.PublishMessage(input.Key, input.Value)
	return &proto.PublishMessageOutput{
		Success: true,
	}, nil
}
