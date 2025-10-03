/*
    rpc MapInsert(MapInsertInput) returns (MapInsertResult);
    rpc MapFetch(MapFetchInput) returns (MapFetchResult);
    rpc MapDelete(MapDeleteInput) returns (MapDeleteResult);

    message MapInsertInput {
        string key=1;
        string value=2;
    }

    message MapFetchInput {
    string key=1;
    }


    message MapDeleteInput {
    string key=1;
    }

    message MapInsertResult {
    int32 result=1;
    }

    message MapFetchResult {
    string value=1;
    }

    message MapDeleteResult {
    int32 result=1;
    }

*/
