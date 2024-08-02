import type { Video } from "@/types/types.ts";
import VideoCard from "@/components/react/VideoCard";

interface VideoListProps {
    videos: Video[];
    removeVideo:  Function
}

const VideoList: React.FC<VideoListProps> = ({ videos, removeVideo }) => {

    return (
        <div className={"bg-gray-300 dark:bg-[#222223] w-11/12 lg:w-5/12 flex flex-col items-center py-4 rounded-xl space-y-2"}>
            {videos.map((video: Video) => {
                return (
                    <VideoCard key={video.url} url={video.url} removeVideo={removeVideo} />
                )
            })}
        </div>
    )
}


export default VideoList;