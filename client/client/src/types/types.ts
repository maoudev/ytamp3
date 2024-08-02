export interface Video {
    url: string
}

export interface VideoInfo {
    title: string,
    channel: string,
    thumbnailUrl: string
}

export interface YoutubeAPI {
    id:                  string;
    title:               string;
    lengthSeconds:       string;
    keywords:            string[];
    channelTitle:        string;
    channelID:           string;
    description:         string;
    thumbnail:           Thumbnail[];
    allowRatings:        boolean;
    viewCount:           string;
    isPrivate:           boolean;
    isUnpluggedCorpus:   boolean;
    isLiveContent:       boolean;
    isCrawlable:         boolean;
    isFamilySafe:        boolean;
    availableCountries:  string[];
    isUnlisted:          boolean;
    category:            string;
    publishDate:         Date;
    uploadDate:          Date;
    subtitles:           Subtitles;
    storyboards:         Storyboard[];
    superTitle:          null;
    likeCount:           string;
    channelThumbnail:    Thumbnail[];
    channelBadges:       string[];
    subscriberCountText: string;
    subscriberCount:     number;
    commentCountText:    string;
    commentCount:        number;
    relatedVideos:       RelatedVideos;
}

export interface Thumbnail {
    url:    string;
    width:  number;
    height: number;
}

export interface RelatedVideos {
    continuation: string;
    data:         Datum[];
}

export interface Datum {
    type:              Type;
    videoID:           string;
    title:             string;
    lengthText:        string;
    viewCount:         string;
    publishedTimeText: string;
    thumbnail:         Thumbnail[];
    channelTitle:      string;
    channelID:         string;
    channelThumbnail:  Thumbnail[];
}

export enum Type {
    Video = "video",
}

export interface Storyboard {
    width:           string;
    height:          string;
    thumbsCount:     string;
    columns:         string;
    rows:            string;
    interval:        string;
    storyboardCount: number;
    url:             string[];
}

export interface Subtitles {
    subtitles:            Subtitle[];
    format:               string;
    translationLanguages: TranslationLanguage[];
}

export interface Subtitle {
    languageName:   string;
    languageCode:   string;
    isTranslatable: boolean;
    url:            string;
}

export interface TranslationLanguage {
    languageCode: string;
    languageName: string;
}


export interface APIResponse {
    files: File[];
}

export interface File {
    file: string;
}
