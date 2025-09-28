package server

import (
	"cacheServer/proto"
	"context"
)

func (server *Server) QueueInsertFront(ctx context.Context, input *proto.QueueInsertInput) (*proto.QueueInsertOutput, error) {
	value := server.Writer.InsertFrontOfQueue(input.Key, input.Value)
	if !value {
		return &proto.QueueInsertOutput{
			Result: -1,
		}, nil
	}
	return &proto.QueueInsertOutput{
		Result: 1,
	}, nil
}

func (server *Server) QueueInsertBack(ctx context.Context, input *proto.QueueInsertInput) (*proto.QueueInsertOutput, error) {
	value := server.Writer.InsertBackOfQueue(input.Key, input.Value)
	if !value {
		return &proto.QueueInsertOutput{
			Result: -1,
		}, nil
	}
	return &proto.QueueInsertOutput{
		Result: 1,
	}, nil
}
