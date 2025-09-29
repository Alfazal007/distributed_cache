package server

import (
	"cacheServer/proto"
	"context"
)

func (server *Server) InsertDataToStream(ctx context.Context, input *proto.InsertDataToStreamInput) (*proto.InsertDataToStreamOutput, error) {
	success, id := server.Writer.AddDataToStream(input.Key, input.Value)
	if !success {
		return &proto.InsertDataToStreamOutput{
			Success: false,
			Id:      -1,
		}, nil
	}
	return &proto.InsertDataToStreamOutput{
		Success: true,
		Id:      id,
	}, nil
}

func (server *Server) RemoveDataFromStream(ctx context.Context, input *proto.RemoveDataFromStreamInput) (*proto.RemoveDataFromStreamOutput, error) {
	success := server.Writer.RemoveDataFromStream(input.Key, input.Id)
	if !success {
		return &proto.RemoveDataFromStreamOutput{
			Success: false,
		}, nil
	}
	return &proto.RemoveDataFromStreamOutput{
		Success: true,
	}, nil
}

func (server *Server) GetStreamRangeData(ctx context.Context, input *proto.GetStreamRangeDataInput) (*proto.GetStreamRangeDataOutput, error) {
	data := server.Writer.GetStreamDataRange(input.Key, input.Start, input.End)
	return &proto.GetStreamRangeDataOutput{
		Value: data,
	}, nil
}
