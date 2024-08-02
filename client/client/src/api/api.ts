import axios from "axios";
import type {APIResponse, Video} from "@/types/types.ts";

export const downloadVideos = (videos: Video[]) => {
    const response =  axios.post("http://localhost:8080/download-many", JSON.stringify(videos), {
        headers: {
            "Content-Type": "application/json",
        }
    })

    let apiReponse: APIResponse

    return response
}