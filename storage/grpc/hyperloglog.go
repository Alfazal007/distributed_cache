package server

import (
	"cacheServer/proto"
	"context"
)

/*
 */
func (server *Server) InsertDataToHLL(ctx context.Context, input *proto.InsertDataToHLLInput) (*proto.InsertDataToHLLOutput, error) {
	success := server.Writer.InsertIntoHll(input.Key, input.Value)
	if !success {
		return &proto.InsertDataToHLLOutput{
			Success: false,
		}, nil
	}
	return &proto.InsertDataToHLLOutput{
		Success: true,
	}, nil
}

func (server *Server) GetCountFromHLL(ctx context.Context, input *proto.GetCountFromHLLInput) (*proto.GetCountFromHLLOutput, error) {
	count := server.Writer.ReturnCountHll(input.Key)
	return &proto.GetCountFromHLLOutput{
		Count: int64(count),
	}, nil
}

func (server *Server) MergeHll(ctx context.Context, input *proto.MergeHllInput) (*proto.MergeHllOutput, error) {
	count := server.Writer.MergeHll(input.Key1, input.Key2, input.Dest)
	return &proto.MergeHllOutput{
		Count: int64(count),
	}, nil
}
