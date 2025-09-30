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
		}
	}
}
