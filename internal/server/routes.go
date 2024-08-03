package server

import (
	"github.com/gin-gonic/gin"
)

func SetupRoutes(e *gin.Engine) {
	e.POST("/download", DownloadSong)
	e.POST("/download-many", DownloadManySongs)
}
