package types

import "encoding/json"

type ErrorMessage struct {
	Message string `json:"message"`
	Error   error  `json:"error"`
}

func GenerateErrorMessage(err error) []byte {
	msg := ErrorMessage{
		Message: "Issue executing the task",
		Error:   err,
	}
	jsonMessage, _ := json.Marshal(msg)
	jsonMessage = append(jsonMessage, '\n')
	return jsonMessage
}
