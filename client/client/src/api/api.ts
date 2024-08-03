import axios from "axios";
import type {Video} from "@/types/types.ts";

export const downloadVideos = (videos: Video[]) => {
    return axios.post("https://ytamp3.com/yt/download-many", JSON.stringify(videos), {
        headers: {
            "Content-Type": "application/json",
        }
    })
}
