package main

import (
	"os"
	"ytamp3/internal/server"
)

func main() {

	if _, err := os.Stat("public/video"); os.IsNotExist(err) {
		os.MkdirAll("public/video", os.ModePerm)
	}

	if _, err := os.Stat("public/song"); os.IsNotExist(err) {
		os.MkdirAll("public/song", os.ModePerm)
	}

	server.Run()
}
