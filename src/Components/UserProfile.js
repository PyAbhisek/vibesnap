import coverPhoto from "../Assests/userDummyCoverPhoto.svg";
import backArrow from "../Assests/backArrow.svg";
import pencil from "../Assests/pencil.svg";
import { useContext, useState } from "react";
import { AppContext } from "../Context/AppContextProvider";
import PostsSection from "./PostsSection";
import plusIcon from "../Assests/plus.svg"
import { useNavigate } from 'react-router-dom';
const UserProfile = () => {
    const context = useContext(AppContext);
    const navigate = useNavigate()
    if (!context) {
        throw new Error("AppContext must be used within a AppContextProvider");
    }

    const { userInfo } = context;
    const edit = () => {
        navigate('/editProfile');
    }
    const newPost = () => {
        navigate("/createpost")
    }
    return (
        <>
            <div className="flex flex-col">
                <div className="w-[100%] relative h-[30%] rounded-b-[1.25rem]">
                    <img src={userInfo.coverPhotoURL || coverPhoto} alt="coverPhoto" className="h-[30%] w-[100%]" />
                    <button className="absolute top-[1.5rem] left-[1.4rem] flex" onClick={() => navigate("/feed")}>
                        <img src={backArrow} alt="backArrow" className="w-[1.6rem] h-auto" />
                    </button>
                    <div className="absolute bottom-[-20.5%] z-[101] left-[1rem]">
                        <div className="relative">
                            <img src={userInfo.photoURL} referrerPolicy="no-referrer" alt="userPic" className="w-[7rem] h-[7rem] rounded-full" />
                        </div>
                    </div>
                    <input type="file" id="profilePicInput" className="hidden" />
                </div>
            </div>
            <div onClick={edit}
                className="flex justify-center rounded-[2.25rem] h-[2rem] mt-[1rem] mr-[1rem] ml-[8.5rem] py-[0.3rem] px-[1rem] border border-[#00000057]">
                <p className="leading-[0.87rem] font-karla text-[0.75rem] font-bold flex justify-center items-center">Edit Profile</p>
            </div>
            <div className="mt-[1.5rem] ml-[0.93rem] mr-[1rem] ">
                <p className="text-[1.5rem] leading-[1.75rem] font-extrabold font-karla">{userInfo?.displayName}</p>
                <p className="leading-[1.08rem] mt-[0.62rem] text-[0.875rem] font-kumbh">Just someone who loves designing, sketching, and finding beauty in the little things 💕</p>
                {/* My Posts */}
                <div className="mt-[1.5rem]">
                    <p className="font-karla font-semibold text-[1.125rem] leading-[1.3rem] text-[#000]">My Posts</p>
                    <PostsSection />
                    <div onClick={newPost}
                        className="rounded-full absolute bottom-[1.75rem] right-[1rem] shadow-lg shadow-[#c3b7b7] flex justify-center items-center  bg-black z-[100] h-[3.125rem] w-[3.125rem]">
                        <img src={plusIcon} alt="plusICon" className="w-[1rem] h-[1rem] " />
                    </div>
                </div>
            </div>

        </>
    )
}
export default UserProfile