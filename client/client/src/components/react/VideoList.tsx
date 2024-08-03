import type { Video } from "@/types/types.ts";
import VideoCard from "@/components/react/VideoCard";

interface VideoListProps {
    videos: Video[];
    removeVideo:  Function
    apiKey: string;
}

const VideoList: React.FC<VideoListProps> = ({ videos, removeVideo, apiKey }) => {

    return (
        <div className={"bg-gray-300 dark:bg-[#222223] w-11/12 lg:w-5/12 flex flex-col items-center py-4 rounded-xl space-y-2"}>
            {videos.map((video: Video) => {
                return (
                    <VideoCard key={video.url} url={video.url} removeVideo={removeVideo} apiKey={apiKey} />
                )
            })}
        </div>
    )
}


export default VideoList;