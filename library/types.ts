export type GrpcMessageType = {
    key: string,
    messageType: GrpcMessageTypes,
    input: any,
    requestId: string
}

export enum GrpcMessageTypes {
    MapInsert = 0,
    MapFetch,
    MapDelete,

    QueueInsertFront,
    QueueInsertBack,
    QueueRemoveFront,
    QueueRemoveBack,

    InsertToSet,
    GetSetValues,
    SetHasMember,
    SetRemoveMember,

    InsertToSortedSet,
    RemoveFromSortedSet,
    GetScoreSortedSet,
    GetRankSortedSet,
    GetRankMembersAsc,
    GetRankMembersDesc,

    InsertDataToStream,
    RemoveDataFromStream,
    GetStreamRangeData,

    InsertDataToHLL,
    GetCountFromHLL,
    MergeHll,

    InsertToBf,
    ExistsInBf,

    PublishMessage,
}
