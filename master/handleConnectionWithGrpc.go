package main

import (
	"bufio"
	"context"
	"encoding/json"
	"fmt"
	"masterServer/types"
	"net"
	"time"

	pb "masterServer/proto"
)

func handleConnectionForGrpc(conn net.Conn, grpcClient pb.CacheInteractClient) {
	scanner := bufio.NewScanner(conn)
	ctx, cancel := context.WithTimeout(context.Background(), time.Second*5)
	defer cancel()

	for scanner.Scan() {
		line := scanner.Text()
		var message types.GrpcMessage
		err := json.Unmarshal([]byte(line), &message)
		if err != nil {
			fmt.Println("Invalid input data ", err)
			continue
		}
		switch message.MessageType {

		case types.MapInsert:
			var insertMapData pb.MapInsertInput
			if err := json.Unmarshal(message.Input, &insertMapData); err != nil {
				errMessage := types.GenerateErrorMessage(err)
				conn.Write(errMessage)
			} else {
				resp, err := grpcClient.MapInsert(ctx, &insertMapData)
				if err != nil {
					errMessage := types.GenerateErrorMessage(err)
					conn.Write(errMessage)
				} else {
					jsonMessage, _ := json.Marshal(resp)
					conn.Write(jsonMessage)
				}
			}
		case types.MapFetch:
			var fetchMapData pb.MapFetchInput
			if err := json.Unmarshal(message.Input, &fetchMapData); err != nil {
				errMessage := types.GenerateErrorMessage(err)
				conn.Write(errMessage)
			} else {
				resp, err := grpcClient.MapFetch(ctx, &fetchMapData)
				if err != nil {
					errMessage := types.GenerateErrorMessage(err)
					conn.Write(errMessage)
				} else {
					jsonMessage, _ := json.Marshal(resp)
					conn.Write(jsonMessage)
				}
			}
		case types.MapDelete:
			var mapDeleteData pb.MapDeleteInput
			if err := json.Unmarshal(message.Input, &mapDeleteData); err != nil {
				errMessage := types.GenerateErrorMessage(err)
				conn.Write(errMessage)
			} else {
				resp, err := grpcClient.MapDelete(ctx, &mapDeleteData)
				if err != nil {
					errMessage := types.GenerateErrorMessage(err)
					conn.Write(errMessage)
				} else {
					jsonMessage, _ := json.Marshal(resp)
					conn.Write(jsonMessage)
				}
			}

		case types.QueueInsertFront:
			var queueInsertFront pb.QueueInsertInput
			if err := json.Unmarshal(message.Input, &queueInsertFront); err != nil {
				errMessage := types.GenerateErrorMessage(err)
				conn.Write(errMessage)
			} else {
				resp, err := grpcClient.QueueInsertFront(ctx, &queueInsertFront)
				if err != nil {
					errMessage := types.GenerateErrorMessage(err)
					conn.Write(errMessage)
				} else {
					jsonMessage, _ := json.Marshal(resp)
					conn.Write(jsonMessage)
				}
			}
		case types.QueueInsertBack:
			var queueInsertBack pb.QueueInsertInput
			if err := json.Unmarshal(message.Input, &queueInsertBack); err != nil {
				errMessage := types.GenerateErrorMessage(err)
				conn.Write(errMessage)
			} else {
				resp, err := grpcClient.QueueInsertBack(ctx, &queueInsertBack)
				if err != nil {
					errMessage := types.GenerateErrorMessage(err)
					conn.Write(errMessage)
				} else {
					jsonMessage, _ := json.Marshal(resp)
					conn.Write(jsonMessage)
				}
			}
		case types.QueueRemoveFront:
			var queueRemoveInput pb.QueueRemoveInput
			if err := json.Unmarshal(message.Input, &queueRemoveInput); err != nil {
				errMessage := types.GenerateErrorMessage(err)
				conn.Write(errMessage)
			} else {
				resp, err := grpcClient.QueueRemoveFront(ctx, &queueRemoveInput)
				if err != nil {
					errMessage := types.GenerateErrorMessage(err)
					conn.Write(errMessage)
				} else {
					jsonMessage, _ := json.Marshal(resp)
					conn.Write(jsonMessage)
				}
			}
		case types.QueueRemoveBack:
			var queueRemoveInput pb.QueueRemoveInput
			if err := json.Unmarshal(message.Input, &queueRemoveInput); err != nil {
				errMessage := types.GenerateErrorMessage(err)
				conn.Write(errMessage)
			} else {
				resp, err := grpcClient.QueueRemoveBack(ctx, &queueRemoveInput)
				if err != nil {
					errMessage := types.GenerateErrorMessage(err)
					conn.Write(errMessage)
				} else {
					jsonMessage, _ := json.Marshal(resp)
					conn.Write(jsonMessage)
				}
			}

		case types.InsertToSet:
			var insertToSetInput pb.InsertToSetInput
			if err := json.Unmarshal(message.Input, &insertToSetInput); err != nil {
				errMessage := types.GenerateErrorMessage(err)
				conn.Write(errMessage)
			} else {
				resp, err := grpcClient.InsertToSet(ctx, &insertToSetInput)
				if err != nil {
					errMessage := types.GenerateErrorMessage(err)
					conn.Write(errMessage)
				} else {
					jsonMessage, _ := json.Marshal(resp)
					conn.Write(jsonMessage)
				}
			}
		case types.SetHasMember:
			var setHasMemberInput pb.SetHasMemberInput
			if err := json.Unmarshal(message.Input, &setHasMemberInput); err != nil {
				errMessage := types.GenerateErrorMessage(err)
				conn.Write(errMessage)
			} else {
				resp, err := grpcClient.SetHasMember(ctx, &setHasMemberInput)
				if err != nil {
					errMessage := types.GenerateErrorMessage(err)
					conn.Write(errMessage)
				} else {
					jsonMessage, _ := json.Marshal(resp)
					conn.Write(jsonMessage)
				}
			}
		case types.GetSetValues:
			var getSetValuesInput pb.GetSetValuesInput
			if err := json.Unmarshal(message.Input, &getSetValuesInput); err != nil {
				errMessage := types.GenerateErrorMessage(err)
				conn.Write(errMessage)
			} else {
				resp, err := grpcClient.GetSetValues(ctx, &getSetValuesInput)
				if err != nil {
					errMessage := types.GenerateErrorMessage(err)
					conn.Write(errMessage)
				} else {
					jsonMessage, _ := json.Marshal(resp)
					conn.Write(jsonMessage)
				}
			}
		case types.SetRemoveMember:
			var setRemoveMemberInput pb.SetRemoveMemberInput
			if err := json.Unmarshal(message.Input, &setRemoveMemberInput); err != nil {
				errMessage := types.GenerateErrorMessage(err)
				conn.Write(errMessage)
			} else {
				resp, err := grpcClient.SetRemoveMember(ctx, &setRemoveMemberInput)
				if err != nil {
					errMessage := types.GenerateErrorMessage(err)
					conn.Write(errMessage)
				} else {
					jsonMessage, _ := json.Marshal(resp)
					conn.Write(jsonMessage)
				}
			}

		case types.InsertToSortedSet:
			var insertToSortedSetInput pb.InsertToSortedSetInput
			if err := json.Unmarshal(message.Input, &insertToSortedSetInput); err != nil {
				errMessage := types.GenerateErrorMessage(err)
				conn.Write(errMessage)
			} else {
				resp, err := grpcClient.InsertToSortedSet(ctx, &insertToSortedSetInput)
				if err != nil {
					errMessage := types.GenerateErrorMessage(err)
					conn.Write(errMessage)
				} else {
					jsonMessage, _ := json.Marshal(resp)
					conn.Write(jsonMessage)
				}
			}
		case types.RemoveFromSortedSet:
			var removeFromSortedSetInput pb.RemoveFromSortedSetInput
			if err := json.Unmarshal(message.Input, &removeFromSortedSetInput); err != nil {
				errMessage := types.GenerateErrorMessage(err)
				conn.Write(errMessage)
			} else {
				resp, err := grpcClient.RemoveFromSortedSet(ctx, &removeFromSortedSetInput)
				if err != nil {
					errMessage := types.GenerateErrorMessage(err)
					conn.Write(errMessage)
				} else {
					jsonMessage, _ := json.Marshal(resp)
					conn.Write(jsonMessage)
				}
			}
		case types.GetScoreSortedSet:
			var getScoreSortedSetInput pb.GetScoreSortedSetInput
			if err := json.Unmarshal(message.Input, &getScoreSortedSetInput); err != nil {
				errMessage := types.GenerateErrorMessage(err)
				conn.Write(errMessage)
			} else {
				resp, err := grpcClient.GetScoreSortedSet(ctx, &getScoreSortedSetInput)
				if err != nil {
					errMessage := types.GenerateErrorMessage(err)
					conn.Write(errMessage)
				} else {
					jsonMessage, _ := json.Marshal(resp)
					conn.Write(jsonMessage)
				}
			}
		case types.GetRankSortedSet:
			var getRankSortedSetInput pb.GetRankSortedSetInput
			if err := json.Unmarshal(message.Input, &getRankSortedSetInput); err != nil {
				errMessage := types.GenerateErrorMessage(err)
				conn.Write(errMessage)
			} else {
				resp, err := grpcClient.GetRankSortedSet(ctx, &getRankSortedSetInput)
				if err != nil {
					errMessage := types.GenerateErrorMessage(err)
					conn.Write(errMessage)
				} else {
					jsonMessage, _ := json.Marshal(resp)
					conn.Write(jsonMessage)
				}
			}
		case types.GetRankMembersAsc:
			var getRankMembersAscInput pb.GetRankMembersInput
			if err := json.Unmarshal(message.Input, &getRankMembersAscInput); err != nil {
				errMessage := types.GenerateErrorMessage(err)
				conn.Write(errMessage)
			} else {
				resp, err := grpcClient.GetRankMembersAsc(ctx, &getRankMembersAscInput)
				if err != nil {
					errMessage := types.GenerateErrorMessage(err)
					conn.Write(errMessage)
				} else {
					jsonMessage, _ := json.Marshal(resp)
					conn.Write(jsonMessage)
				}
			}
		case types.GetRankMembersDesc:
			var getRankMembersDescInput pb.GetRankMembersInput
			if err := json.Unmarshal(message.Input, &getRankMembersDescInput); err != nil {
				errMessage := types.GenerateErrorMessage(err)
				conn.Write(errMessage)
			} else {
				resp, err := grpcClient.GetRankMembersDesc(ctx, &getRankMembersDescInput)
				if err != nil {
					errMessage := types.GenerateErrorMessage(err)
					conn.Write(errMessage)
				} else {
					jsonMessage, _ := json.Marshal(resp)
					conn.Write(jsonMessage)
				}
			}

		}
	}
}
