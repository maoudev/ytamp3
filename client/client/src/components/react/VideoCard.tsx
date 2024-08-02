import {useEffect, useState} from "react";
import type {Video, VideoInfo, YoutubeAPI} from "@/types/types.ts";

import axios from "axios";
import getVideoId from 'get-video-id';



interface VideoCardProps {
    url: string;
    removeVideo:  Function;
}

const VideoCard: React.FC<VideoCardProps> = ({ url, removeVideo }) => {
    const [ videoInfo, setVideoInfo ] = useState<VideoInfo>({ title: "", channel: "", thumbnailUrl: "" });


    useEffect(() => {
        const getInfo = async () => {
            const id = getVideoId(url)
           const data = await axios.get(`https://yt-api.p.rapidapi.com/video/info?id=${id.id}`, {
               headers: {
                   'x-rapidapi-key': 'af8ad1bbefmsh454538bb2a2197bp1001adjsn76fdfb530abc',
                   'x-rapidapi-host': 'yt-api.p.rapidapi.com'
               }
           })

            return data;
        }

        getInfo().then(function ({ data }: { data: YoutubeAPI }) {
            setVideoInfo({
                title: data.title,
                channel: data.channelTitle,
                thumbnailUrl: data.thumbnail[0].url
            })
        })
    }, [url])


    return (
        <div
            className="relative w-11/12 border-2 shadow-inner shadow-2xl border-gray-400 dark:border-[#212322] overflow-clip flex flex-col md:flex-row p-3 bg-gray-400 dark:bg-[#3d3c38] h-fit rounded-xl">
            <svg
                onClick={() => removeVideo(url)}
                className="absolute top-2 text-white right-2 inline w-4 h-4 fill-current ml-2 hover:opacity-80 cursor-pointer"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
            >
                <path
                    d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM359.5 133.7c-10.11-8.578-25.28-7.297-33.83 2.828L256 218.8L186.3 136.5C177.8 126.4 162.6 125.1 152.5 133.7C142.4 142.2 141.1 157.4 149.7 167.5L224.6 256l-74.88 88.5c-8.562 10.11-7.297 25.27 2.828 33.83C157 382.1 162.5 384 167.1 384c6.812 0 13.59-2.891 18.34-8.5L256 293.2l69.67 82.34C330.4 381.1 337.2 384 344 384c5.469 0 10.98-1.859 15.48-5.672c10.12-8.562 11.39-23.72 2.828-33.83L287.4 256l74.88-88.5C370.9 157.4 369.6 142.2 359.5 133.7z"/>
            </svg>
            <img src={videoInfo.thumbnailUrl} alt="thumbnail" width={168} height={90}/>
            <div className="text-white md:ml-4">
                <p className="font-black">{videoInfo.title}</p>
                <p className="font-medium">{videoInfo.channel}</p>
            </div>
        </div>
    );
};


export default VideoCard;
