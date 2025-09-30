package types

import (
// pb "masterServer/proto"
)

/*
rpc MapInsert(MapInsertInput) returns (MapInsertResult);
rpc MapFetch(MapFetchInput) returns (MapFetchResult);
rpc MapDelete(MapDeleteInput) returns (MapDeleteResult);
*/

type MapInsertType struct {
	//Input can be either *pb.MapInsertInput or *pb.MapFetchInput,
}
