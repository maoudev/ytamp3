package models

// DownloadRequest is a simple request.
type DownloadRequest struct {
	URL string `json:"url"` // URL is the url of the YouTube video.
}

// DownloadResponse is a simple response.
type DownloadResponse struct {
	File string `json:"file"` // File is the name of the song file.
}
