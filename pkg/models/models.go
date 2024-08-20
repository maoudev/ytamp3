package models

import (
	"net/url"
	"regexp"
)

// DownloadRequest is a simple request.
type DownloadRequest struct {
	URL string `json:"url"` // URL is the url of the YouTube video.
}

// DownloadResponse is a simple response.
type DownloadResponse struct {
	File string `json:"file"` // File is the name of the song file.
}

func (r *DownloadRequest) isValid() bool {
	if r.URL == "" {
		return false
	}

	if _, err := url.Parse(r.URL); err != nil {
		return false
	}

	match, err := regexp.Match("^(https?:\\/\\/)?(www\\.)?(youtube\\.com|youtu\\.be|m\\.youtube\\.com)\\/(watch\\?v=|embed\\/|v\\/|.+\\?v=)?([a-zA-Z0-9_-]{11})(\\S*)?$", []byte(r.URL))
	if err != nil {
		return false
	}

	if !match {
		return false
	}

	return true
}

type Cookie struct {
	Domain         string  `json:"domain"`
	ExpirationDate float64 `json:"expirationDate"`
	HostOnly       bool    `json:"hostOnly"`
	HttpOnly       bool    `json:"httpOnly"`
	Name           string  `json:"name"`
	Path           string  `json:"path"`
	SameSite       string  `json:"sameSite"`
	Secure         bool    `json:"secure"`
	Session        bool    `json:"session"`
	StoreId        *string `json:"storeId"`
	Value          string  `json:"value"`
}
