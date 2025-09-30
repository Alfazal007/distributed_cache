package main

import (
	datahandler "cacheServer/dataHandler"
	"encoding/json"
	"net"
	"slices"
)

func channelHandler(conn net.Conn, writer *datahandler.Writer, done <-chan bool) {
	for {
		select {
		case msg := <-writer.Queue.SubscibeToChannel:
			if msg.ShouldSubscribe {
				if !slices.Contains(writer.Queue.SubscribedToKeys, msg.Key) {
					writer.Queue.SubscribedToKeys = append(writer.Queue.SubscribedToKeys, msg.Key)
				}
			} else {
				idx := -1
				for index, key := range writer.Queue.SubscribedToKeys {
					if key == msg.Key {
						idx = index
						break
					}
				}
				if idx != -1 {
					writer.Queue.SubscribedToKeys = append(writer.Queue.SubscribedToKeys[:idx], writer.Queue.SubscribedToKeys[idx+1:]...)
				}
			}
		case msg := <-writer.Queue.PublishToChannel:
			jsonData, _ := json.Marshal(msg)
			conn.Write(jsonData)

		case msg := <-writer.Stream.SubscibeToChannel:
			if msg.ShouldSubscribe {
				if !slices.Contains(writer.Stream.SubscribedToKeys, msg.Key) {
					writer.Stream.SubscribedToKeys = append(writer.Stream.SubscribedToKeys, msg.Key)
				}
			} else {
				idx := -1
				for index, key := range writer.Stream.SubscribedToKeys {
					if key == msg.Key {
						idx = index
						break
					}
				}
				if idx != -1 {
					writer.Stream.SubscribedToKeys = append(writer.Stream.SubscribedToKeys[:idx], writer.Stream.SubscribedToKeys[idx+1:]...)
				}
			}
		case msg := <-writer.Stream.PublishToChannel:
			jsonData, _ := json.Marshal(msg)
			conn.Write(jsonData)
		case msg := <-writer.PubSub.SubscibeToChannel:
			if msg.ShouldSubscribe {
				if !slices.Contains(writer.PubSub.SubscribedToKeys, msg.Key) {
					writer.PubSub.SubscribedToKeys = append(writer.PubSub.SubscribedToKeys, msg.Key)
				}
			} else {
				idx := -1
				for index, key := range writer.PubSub.SubscribedToKeys {
					if key == msg.Key {
						idx = index
						break
					}
				}
				if idx != -1 {
					writer.PubSub.SubscribedToKeys = append(writer.PubSub.SubscribedToKeys[:idx], writer.PubSub.SubscribedToKeys[idx+1:]...)
				}
			}
		case msg := <-writer.PubSub.PublishToChannel:
			jsonData, _ := json.Marshal(msg)
			conn.Write(jsonData)
		case <-done:
			writer.Queue.SubscribedToKeys = make([]string, 0)
			return
		}
	}
}
