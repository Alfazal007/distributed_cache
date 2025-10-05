package types

import "encoding/json"

type ErrorMessage struct {
	Message string `json:"message"`
	Error   error  `json:"error"`
	Id      string `json:"id"`
}

func GenerateErrorMessage(err error, id string) []byte {
	msg := ErrorMessage{
		Message: "Issue executing the task",
		Error:   err,
		Id:      id,
	}
	jsonMessage, _ := json.Marshal(msg)
	jsonMessage = append(jsonMessage, '\n')
	return jsonMessage
}
