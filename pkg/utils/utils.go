package utils

import (
	"encoding/json"
	"net/http"
	"net/http/cookiejar"
	"net/url"
	"os"
	"time"
	"ytamp3/pkg/models"
)

func LoadCookiesFromFile(path string) ([]*http.Cookie, error) {
	var cookies []*http.Cookie

	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	var jsonCookies []models.Cookie
	if err := json.Unmarshal(data, &jsonCookies); err != nil {
		return nil, err
	}

	for _, c := range jsonCookies {
		expiration := time.Unix(int64(c.ExpirationDate), 0)
		cookies = append(cookies, &http.Cookie{
			Domain:   c.Domain,
			Path:     c.Path,
			Name:     c.Name,
			Value:    c.Value,
			Secure:   c.Secure,
			HttpOnly: c.HttpOnly,
			Expires:  expiration,
		})
	}

	return cookies, nil
}

func GetCookieJar(cookies []*http.Cookie) http.CookieJar {
	jar, _ := cookiejar.New(nil)
	url, _ := url.Parse("https://www.youtube.com")
	jar.SetCookies(url, cookies)
	return jar
}
