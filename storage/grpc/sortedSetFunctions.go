package server

import (
	"cacheServer/proto"
	"context"
)

func (server *Server) InsertToSortedSet(ctx context.Context, input *proto.InsertToSortedSetInput) (*proto.InsertToSortedSetOutput, error) {
	success := server.Writer.InsertToSortedSet(input.Key, input.MainKey, input.Value)
	if !success {
		return &proto.InsertToSortedSetOutput{
			Result: -1,
		}, nil
	}
	return &proto.InsertToSortedSetOutput{
		Result: 1,
	}, nil
}

func (server *Server) RemoveFromSortedSet(ctx context.Context, input *proto.RemoveFromSortedSetInput) (*proto.RemoveFromSortedSetOutput, error) {
	success := server.Writer.RemoveFromSortedSet(input.Key, input.MainKey)
	if !success {
		return &proto.RemoveFromSortedSetOutput{
			Result: -1,
		}, nil
	}
	return &proto.RemoveFromSortedSetOutput{
		Result: 1,
	}, nil
}

func (server *Server) GetScoreSortedSet(ctx context.Context, input *proto.GetScoreSortedSetInput) (*proto.GetScoreSortedSetOutput, error) {
	score := server.Writer.GetScoreFromSortedSet(input.Key, input.MainKey)
	return &proto.GetScoreSortedSetOutput{
		Score: score,
	}, nil
}

func (server *Server) GetRankSortedSet(ctx context.Context, input *proto.GetRankSortedSetInput) (*proto.GetRankSortedSetOutput, error) {
	rank := server.Writer.GetRankFromSortedSet(input.Key, input.MainKey)
	return &proto.GetRankSortedSetOutput{
		Rank: rank,
	}, nil
}

func (server *Server) GetRankMembersAsc(ctx context.Context, input *proto.GetRankMembersInput) (*proto.GetRankMembersOutput, error) {
	rankMembers := server.Writer.GetRankAndMembersAscFromSortedSet(input.MainKey)
	res := make([]*proto.ScoreAndName, 0)
	for _, rankMember := range rankMembers {
		res = append(res, &proto.ScoreAndName{Score: rankMember.Score, Name: rankMember.Name})
	}
	return &proto.GetRankMembersOutput{
		MembersAndScore: res,
	}, nil
}

func (server *Server) GetRankMembersDesc(ctx context.Context, input *proto.GetRankMembersInput) (*proto.GetRankMembersOutput, error) {
	rankMembers := server.Writer.GetRankAndMembersDescFromSortedSet(input.MainKey)
	res := make([]*proto.ScoreAndName, 0)
	for _, rankMember := range rankMembers {
		res = append(res, &proto.ScoreAndName{Score: rankMember.Score, Name: rankMember.Name})
	}
	return &proto.GetRankMembersOutput{
		MembersAndScore: res,
	}, nil
}
