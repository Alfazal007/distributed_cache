package server

import (
	"cacheServer/proto"
	"context"
)

func (server *Server) QueueRemoveFront(ctx context.Context, input *proto.QueueRemoveInput) (*proto.QueueRemoveOutput, error) {
	success, byteData := server.Writer.DeleteFrontOfQueue(input.Key)
	if !success {
		return &proto.QueueRemoveOutput{
			Value: nil,
		}, nil
	}
	return &proto.QueueRemoveOutput{
		Value: byteData,
	}, nil
}

func (server *Server) QueueRemoveBack(ctx context.Context, input *proto.QueueRemoveInput) (*proto.QueueRemoveOutput, error) {
	success, byteData := server.Writer.DeleteBackOfQueue(input.Key)
	if !success {
		return &proto.QueueRemoveOutput{
			Value: nil,
		}, nil
	}
	return &proto.QueueRemoveOutput{
		Value: byteData,
	}, nil
}
