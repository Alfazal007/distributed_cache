package config

const TOTALSIZE = 1024 * 1024 // 1 MB
var CURRENTSIZE = 0

type DeletionProtocol int

const (
	LRU DeletionProtocol = iota
	LFU
	SAMPLING
)

const CURRENTDELETIONPROTOCOL = SAMPLING
