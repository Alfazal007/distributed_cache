package server

import (
	"cacheServer/proto"
	"context"
)

func (server *Server) InsertToSet(ctx context.Context, input *proto.InsertToSetInput) (*proto.InsertToSetOutput, error) {
	success := server.Writer.InsertToSet(input.Key, input.Value)
	if !success {
		return &proto.InsertToSetOutput{
			Result: -1,
		}, nil
	}
	return &proto.InsertToSetOutput{
		Result: 1,
	}, nil
}

func (server *Server) GetSetValues(ctx context.Context, input *proto.GetSetValuesInput) (*proto.GetSetValuesOutput, error) {
	members := server.Writer.GetSetMembers(input.Key)
	return &proto.GetSetValuesOutput{
		Values: members,
	}, nil
}

func (server *Server) SetHasMember(ctx context.Context, input *proto.SetHasMemberInput) (*proto.SetHasMemberOutput, error) {
	exists := server.Writer.ExistsInSet(input.Key, input.Value)
	return &proto.SetHasMemberOutput{
		HasValue: exists,
	}, nil
}

func (server *Server) SetRemoveMember(ctx context.Context, input *proto.SetRemoveMemberInput) (*proto.SetRemoveMemberOutput, error) {
	success := server.Writer.RemoveFromSet(input.Key, input.Value)
	if success {
		return &proto.SetRemoveMemberOutput{
			Result: 1,
		}, nil
	}
	return &proto.SetRemoveMemberOutput{
		Result: -1,
	}, nil
}
