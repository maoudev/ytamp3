import {useEffect, useState} from "react";

import type {APIResponse, Video} from "@/types/types.ts"
import VideoList from "@/components/react/VideoList.tsx";
import {downloadVideos} from "@/api/api.ts";

const URL_REGEX = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(?:-nocookie)?\.com|youtu.be))(\/(?:[\w\-]+\?v=|embed\/|live\/|v\/)?)([\w\-]+)(\S+)?$/;


const DownloadForm = () => {
    const [ url, setUrl ] = useState<string>("");
    const [ videoList, setVideoList ] = useState<Video[]>([])
    const [ isInputEmpty, setIsInputEmpty ] = useState<boolean>(false)
    const [ isValidUrl, setIsValidUrl ] = useState<boolean>(true)
    const [ disableDownload, setDisableDownload ] = useState<boolean>(true)
    const [ error, setError ] = useState<boolean>(false)
    const [ loading, setLoading ] = useState<boolean>(false)

    useEffect(() => {
        if (videoList.length > 0) {
            setDisableDownload(false)
        } else {
            setDisableDownload(true)
        }
    }, [videoList]);

    useEffect(() => {
        const savedVideoList = localStorage.getItem('videoList');
        if (savedVideoList) {
            setVideoList(JSON.parse(savedVideoList));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('videoList', JSON.stringify(videoList));
    }, [videoList]);

    const addVideo = () => {
        setIsInputEmpty(false)
        setIsValidUrl(true)

        if (url.trim() != "") {
            if (URL_REGEX.test(url)) {
                if (!videoList.some(video => video.url === url)) {
                    setVideoList([...videoList, { url: url }]);
                    setUrl("");
                }
            } else {
                setIsValidUrl(false)
            }


        } else {
            setIsInputEmpty(true)
        }
    };


    const handleRemove = (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
        const target = event.currentTarget;
        const alertElement = target.closest('[role="alert"]');
        if (alertElement) {
            alertElement.remove();
        }
    };

    const removeVideo = (url: string) => {
        setVideoList(videoList.filter(v => v.url !== url))
        localStorage.setItem('videoList', JSON.stringify(videoList));
    }

    const download = () => {
        setError(false)
        setDisableDownload(true)

        setLoading(true)

        const response = downloadVideos(videoList)
        response.then(function ({ data }: { data: APIResponse }) {
            data.files.forEach((v) => {
                const fileUrl = `http://localhost:8080/${v.file}.mp3`;

                const link = document.createElement('a');
                link.href = fileUrl;
                link.download = v.file + ".mp3";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });

            localStorage.removeItem("videoList");
            setVideoList([])
            setUrl("")
            setDisableDownload(true)
            setLoading(false)

        }).catch(() => {
            setUrl("")
            setDisableDownload(true)
            setError(true)
        })
    }

    return (
        <>
            {isInputEmpty ? (
                <div className="w-full md:w-1/3 mx-auto">
                    <div
                        className="mt-5 flex items-center justify-between p-5 leading-normal text-red-600 bg-red-100 rounded-lg"
                        role="alert"
                    >
                        <p>¡Por favor, Ingrese una url!</p>
                        <svg
                            onClick={handleRemove}
                            className="inline w-4 h-4 fill-current ml-2 hover:opacity-80 cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                        >
                            <path
                                d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM359.5 133.7c-10.11-8.578-25.28-7.297-33.83 2.828L256 218.8L186.3 136.5C177.8 126.4 162.6 125.1 152.5 133.7C142.4 142.2 141.1 157.4 149.7 167.5L224.6 256l-74.88 88.5c-8.562 10.11-7.297 25.27 2.828 33.83C157 382.1 162.5 384 167.1 384c6.812 0 13.59-2.891 18.34-8.5L256 293.2l69.67 82.34C330.4 381.1 337.2 384 344 384c5.469 0 10.98-1.859 15.48-5.672c10.12-8.562 11.39-23.72 2.828-33.83L287.4 256l74.88-88.5C370.9 157.4 369.6 142.2 359.5 133.7z"/>
                        </svg>
                    </div>
                </div>
            ) : null}

            {!isValidUrl ? (
                <div className="w-full md:w-1/3 mx-auto">
                    <div
                        className="mt-5 flex items-center justify-between p-5 leading-normal text-red-600 bg-red-100 rounded-lg"
                        role="alert"
                    >
                        <p>¡La url ingresada no es valida!</p>
                        <svg
                            onClick={handleRemove}
                            className="inline w-4 h-4 fill-current ml-2 hover:opacity-80 cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                        >
                            <path
                                d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM359.5 133.7c-10.11-8.578-25.28-7.297-33.83 2.828L256 218.8L186.3 136.5C177.8 126.4 162.6 125.1 152.5 133.7C142.4 142.2 141.1 157.4 149.7 167.5L224.6 256l-74.88 88.5c-8.562 10.11-7.297 25.27 2.828 33.83C157 382.1 162.5 384 167.1 384c6.812 0 13.59-2.891 18.34-8.5L256 293.2l69.67 82.34C330.4 381.1 337.2 384 344 384c5.469 0 10.98-1.859 15.48-5.672c10.12-8.562 11.39-23.72 2.828-33.83L287.4 256l74.88-88.5C370.9 157.4 369.6 142.2 359.5 133.7z"/>
                        </svg>
                    </div>
                </div>
            ) : null}

            {error ? (
                <div className="w-full md:w-1/3 mx-auto">
                    <div
                        className="mt-5 flex items-center justify-between p-5 leading-normal text-red-600 bg-red-100 rounded-lg"
                        role="alert"
                    >
                        <p>¡Error Al Descargar!</p>
                        <svg
                            onClick={handleRemove}
                            className="inline w-4 h-4 fill-current ml-2 hover:opacity-80 cursor-pointer"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                        >
                            <path
                                d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256s256-114.6 256-256S397.4 0 256 0zM256 464c-114.7 0-208-93.31-208-208S141.3 48 256 48s208 93.31 208 208S370.7 464 256 464zM359.5 133.7c-10.11-8.578-25.28-7.297-33.83 2.828L256 218.8L186.3 136.5C177.8 126.4 162.6 125.1 152.5 133.7C142.4 142.2 141.1 157.4 149.7 167.5L224.6 256l-74.88 88.5c-8.562 10.11-7.297 25.27 2.828 33.83C157 382.1 162.5 384 167.1 384c6.812 0 13.59-2.891 18.34-8.5L256 293.2l69.67 82.34C330.4 381.1 337.2 384 344 384c5.469 0 10.98-1.859 15.48-5.672c10.12-8.562 11.39-23.72 2.828-33.83L287.4 256l74.88-88.5C370.9 157.4 369.6 142.2 359.5 133.7z"/>
                        </svg>
                    </div>
                </div>
            ) : null}

            <form
                className="flex flex-col items-center mt-4 space-y-5"
                onSubmit={(e) => e.preventDefault()}
            >
                <label className="dark:text-white text-lg lg:text-md" htmlFor="url">
                    Inserta la url del video de youtube
                </label>
                <input
                    id="url"
                    className="bg-transparent lg:w-1/5 text-black dark:text-white rounded-lg border border-red-300 focus:border-blue-500 hover:border-red-500 px-3 py-2 outline-none transition-colors"
                    type="text"
                    name="url"
                    onChange={(e) => {
                        setUrl(e.target.value)
                    }}
                    value={url}
                    placeholder="www.youtube.com/watch?v=..."
                    required
                />
                <div className={"flex items-center space-x-4"}>
                    <button className={"dark:text-white rounded px-4 py-2  border border-red-300 hover:border-red-500"}
                            type={"submit"}
                            onClick={() => addVideo()}
                    >Añadir
                    </button>
                    <button
                        className={"dark:text-white rounded px-4 py-2 border border-red-300 hover:border-red-500 disabled:border-gray-400"}
                        type={"button"}
                        disabled={disableDownload}
                        onClick={() => download()}
                    >Descargar
                    </button>
                </div>
                {loading ? (
                    <div className={'flex space-x-2 justify-center items-center dark:invert'}>
                        <span className={'sr-only'}>Loading...</span>
                        <div className={'h-3 w-3 bg-black rounded-full animate-bounce [animation-delay:-0.3s]'}></div>
                        <div className={'h-3 w-3 bg-black rounded-full animate-bounce [animation-delay:-0.15s]'}></div>
                        <div className={'h-3 w-3 bg-black rounded-full animate-bounce'}></div>
                    </div>
                ) : null}
            </form>


            <div className={"mt-5 flex items-center justify-center"}>
                <VideoList videos={videoList} removeVideo={removeVideo}/>
            </div>
        </>
    )
}

export default DownloadForm;