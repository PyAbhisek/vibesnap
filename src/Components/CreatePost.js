import backArrow from "../Assests/blackBackArrow.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import camera from "../Assests/camera.svg";

const CreatePost = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const navigate = useNavigate();

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);
        setCurrentSlide(0);
    };

    const handleNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % selectedFiles.length);
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + selectedFiles.length) % selectedFiles.length);
    };


    const isVideo = (file) => file.type.startsWith("video/");

    return (
        <>
            <div className="">
                <button
                    className="absolute top-[1.5rem] left-[1.4rem] flex"
                    onClick={() => navigate("/profile")}
                >
                    <img src={backArrow} alt="backArrow" className="w-[1.6rem] h-auto" />
                    <p className="font-extrabold font-karla leading-[1.46rem] text-[1.25rem] ml-[0.8rem]">New Post</p>
                </button>
                <div className="flex items-center justify-center mt-[6rem]">

                    <div className="mx-[2.6rem] w-full flex items-center justify-center aspect-square rounded-[0.75rem] bg-[#d3d3d3] relative overflow-hidden">
                        {selectedFiles.length > 0 && (
                            <div className="absolute top-2 right-2 z-10 bg-white bg-opacity-60 text-black w-auto h-auto px-[7px] py-[3px] rounded-[0.6rem] text-sm font-semibold">
                                {currentSlide + 1} / {selectedFiles.length}
                            </div>
                        )}
                        {selectedFiles.length === 0 ? (
                            <label htmlFor="file-input">
                                <img src={camera} alt="camera" className="w-[5rem] h-auto cursor-pointer" />
                            </label>
                        ) : selectedFiles.length === 1 ? (
                            isVideo(selectedFiles[0]) ? (
                                <video
                                    src={URL.createObjectURL(selectedFiles[0])}
                                    alt="Selected video"
                                    className="w-full h-full object-cover rounded-[0.75rem]"
                                    autoPlay
                                    muted={false}
                                />
                            ) : (
                                <img
                                    src={URL.createObjectURL(selectedFiles[0])}
                                    alt="Selected image"
                                    className="w-full h-full object-cover rounded-[0.75rem]"
                                />
                            )
                        ) : (
                            <div className="w-full h-full relative">
                                <img
                                    src={URL.createObjectURL(selectedFiles[currentSlide])}
                                    alt={`Slide ${currentSlide + 1}`}
                                    className="w-full h-full object-cover rounded-[0.75rem]"
                                />
                            </div>
                        )}
                        <input
                            id="file-input"
                            type="file"
                            accept="image/*, video/*"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>

                </div>
                <div className="mt-[0.62rem] flex gap-[3px] w-full justify-center items-center">
                    {selectedFiles.length > 1 &&
                        selectedFiles.map((_, index) => (
                            <div
                                key={index}
                                className={`w-[8px] h-[8px] rounded-full cursor-pointer transition-all duration-300
                    ${index === currentSlide ? "bg-black" : "bg-gray-400"}`}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                </div>
            </div >
            <div className="mt-[1.8rem] flex justify-center">
                <div className="flex flex-col w-[90%] justify-center items-start">
                    <textarea
                        type="text"
                        name="NewPost"
                        placeholder="What's on your mind"
                        className="border-b-[0.4px] w-full border-black text-[0.87rem] leading-[1.24rem] font-semibold font-kumbh"
                    />
                </div>
            </div>
            <div className="absolute top-[90%] left-0 right-0 flex justify-center items-center">
                <button
                    disabled={isLoading}
                    className="bg-[#000] text-white px-[1rem] py-[0.31rem] font-karla h-[3rem] font-bold rounded-[2.25rem] w-[20.5rem]"
                >
                    {isLoading ? "Creating..." : "Create"}
                </button>
            </div>
        </>
    );
};

export default CreatePost;
