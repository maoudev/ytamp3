package server

import (
	"fmt"
	"github.com/bogem/id3v2"
	"github.com/gin-gonic/gin"
	"github.com/kkdai/youtube/v2"
	"io"
	"log"
	"log/slog"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"sync"
	"time"
	"ytamp3/pkg/models"
	"ytamp3/pkg/utils"
)

func DownloadManySongs(c *gin.Context) {
	var requests []*models.DownloadRequest
	if err := c.Bind(&requests); err != nil {
		c.JSON(http.StatusBadRequest, nil)
		return
	}

	downloadMany(c, requests)

}

func DownloadSong(c *gin.Context) {
	var video *models.DownloadRequest
	if err := c.BindJSON(&video); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	pth := filepath.Join("internal", "server", "cookies.json")

	absPath, err := filepath.Abs(pth)
	if err != nil {
		log.Fatalf("Error obtaining absolute path: %v", err)
	}

	cookies, err := utils.LoadCookiesFromFile(absPath)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	customHttpClient := &http.Client{
		Jar: utils.GetCookieJar(cookies),
	}

	downloadSong(video.URL, c, customHttpClient)

}

func downloadMany(c *gin.Context, request []*models.DownloadRequest) {
	wg := &sync.WaitGroup{}
	ch := make(chan *models.DownloadResponse)

	pth := filepath.Join("internal", "server", "cookies.json")

	absPath, err := filepath.Abs(pth)
	if err != nil {
		log.Fatalf("Error obtaining absolute path: %v", err)
	}

	cookies, err := utils.LoadCookiesFromFile(absPath)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	customHttpClient := &http.Client{
		Jar: utils.GetCookieJar(cookies),
	}

	for _, song := range request {
		wg.Add(1)
		go downloadSongGo(song.URL, wg, ch, customHttpClient)
	}

	go func() {
		wg.Wait()
		close(ch)
	}()

	var files []*models.DownloadResponse
	for result := range ch {
		files = append(files, result)
	}

	c.JSON(http.StatusOK, gin.H{
		"files": files,
	})
}

func downloadSongGo(url string, wg *sync.WaitGroup, ch chan *models.DownloadResponse, customHttpClient *http.Client) {

	client := youtube.Client{
		HTTPClient: customHttpClient,
	}

	video, err := client.GetVideo(url)
	if err != nil {
		return
	}
	format := video.Formats.WithAudioChannels()

	stream, _, err := client.GetStream(video, &format[0])
	if err != nil {
		return
	}

	fileName := video.Title

	if err = saveVideo(fileName, stream); err != nil {
		return
	}

	if err = saveSong(fileName); err != nil {
		return
	}

	if err = addMetadata(fileName, video.Title, video.Author); err != nil {
		return
	}

	if err = removeVideo(fileName); err != nil {
		return
	}

	ch <- &models.DownloadResponse{File: fileName}

	removeSong(fileName)
	defer wg.Done()
}

func downloadSong(url string, c *gin.Context, customHttpClient *http.Client) {

	client := youtube.Client{
		HTTPClient: customHttpClient,
	}

	video, err := client.GetVideo(url)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	format := video.Formats.WithAudioChannels()

	stream, _, err := client.GetStream(video, &format[0])
	if err != nil {
		c.JSON(http.StatusInternalServerError, nil)
		return
	}

	fileName := video.Title

	if err = saveVideo(fileName, stream); err != nil {
		c.JSON(http.StatusInternalServerError, nil)
		return
	}

	if err = saveSong(fileName); err != nil {
		c.JSON(http.StatusInternalServerError, nil)
		return
	}

	if err = addMetadata(fileName, video.Title, video.Author); err != nil {
		c.JSON(http.StatusInternalServerError, nil)
		return
	}

	if err = removeVideo(fileName); err != nil {
		c.JSON(http.StatusInternalServerError, nil)
		return
	}

	response := &models.DownloadResponse{File: fileName}

	c.JSON(http.StatusOK, response)
	removeSong(fileName)
}

func saveVideo(fileName string, stream io.ReadCloser) error {
	file, err := os.Create(filepath.Join("public/video", fileName+".mp4"))
	if err != nil {
		return err
	}

	defer func(file *os.File) {
		err := file.Close()
		if err != nil {
			slog.Error(err.Error())
		}
	}(file)

	_, err = io.Copy(file, stream)
	if err != nil {
		return err
	}

	return nil
}

func saveSong(fileName string) error {
	videoFileName := filepath.Join("public/video", fileName+".mp4")
	songFileName := filepath.Join("public/song", fileName+".mp3")

	cmd := exec.Command("ffmpeg", "-y", "-i", videoFileName, "-vn", "-ar", "44100", "-ac", "2", "-b:a", "320k", songFileName)
	if err := cmd.Run(); err != nil {
		return err
	}

	return nil
}

func removeSong(fileName string) {
	time.AfterFunc(3*time.Minute, func() {
		if err := os.Remove(filepath.Join("public/song", fileName+".mp3")); err != nil {
			slog.Error(err.Error())
		}
	})

}

func removeVideo(fileName string) error {
	if err := os.Remove(filepath.Join("public/video", fileName+".mp4")); err != nil {
		return err
	}

	return nil
}

func addMetadata(fileName, title, artist string) error {
	tag, err := id3v2.Open(filepath.Join("public/song", fileName+".mp3"), id3v2.Options{Parse: true})
	if err != nil {
		return fmt.Errorf("error: %w", err)
	}
	defer func(tag *id3v2.Tag) {
		err := tag.Close()
		if err != nil {
			slog.Error(err.Error())
		}
	}(tag)

	tag.SetTitle(title)
	tag.SetArtist(artist)

	if err = tag.Save(); err != nil {
		return fmt.Errorf("error: %w", err)
	}

	return nil
}
