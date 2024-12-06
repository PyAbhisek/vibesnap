import backArrow from "../Assests/blackBackArrow.svg"
import { useState } from "react";
import { useNavigate } from "react-router-dom"
import camera from "../Assests/camera.svg"
const CreatePost = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()
    return (
        <>
            <div className="">
                <button className="absolute top-[1.5rem] left-[1.4rem] flex" onClick={() => { navigate("/profile") }} >
                    <img src={backArrow} alt="backArrow" className="w-[1.6rem] h-auto" />
                    <p className="font-extrabold font-karla leading-[1.46rem] text-[1.25rem]  ml-[0.8rem]">New Post</p>
                </button>
                <div className="flex items-center justify-center mt-[6rem]" >
                    <div className="mx-[2.6rem] w-full flex items-center justify-center aspect-square rounded-[0.75rem] bg-[#d3d3d3]">
                        <img src={camera} alt="camera" className="w-[5rem] h-[auto]" />
                    </div>

                </div>
            </div>
            <div className="mt-[1.8rem] flex justify-center">
                <div className="flex flex-col w-[90%] justify-center items-start">
                    <input
                        type="text"
                        name="NewPost"
                        placeholder="Whats on your mind"
                        className="border-b-[0.4px] w-full border-black text-[0.87rem] leading-[1.24rem] font-semibold font-kumbh"
                    />
                </div>
            </div>
            <div className="absolute top-[90%] left-0 right-0 flex justify-center items-center">
                <button disabled={isLoading} className="bg-[#000] text-white px-[1rem] py-[0.31rem] font-karla h-[3rem] font-bold rounded-[2.25rem] w-[20.5rem]">
                    {isLoading ? "Creating..." : "Create"}
                </button>
            </div>
        </>
    )
}

export default CreatePost