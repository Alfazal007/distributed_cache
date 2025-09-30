package main

import (
	"bufio"
	"net"
)

func HandleConnectionInputAndChannelExchange(conn net.Conn) {
	scanner := bufio.NewScanner(conn)
	for scanner.Scan() {
		_ = scanner.Text()
	}
}
