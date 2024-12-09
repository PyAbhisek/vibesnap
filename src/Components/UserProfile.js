import coverPhoto from "../Assests/userDummyCoverPhoto.svg";
import backArrow from "../Assests/backArrow.svg";
import pencil from "../Assests/pencil.svg";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../Context/AppContextProvider";
import PostsSection from "./PostsSection";
import plusIcon from "../Assests/plus.svg"
import { useNavigate } from 'react-router-dom';
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";
import { db, storage } from "../Services/Firebase";
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
    useEffect(() => {
        const syncUserProfile = async () => {
            try {
                const userDocRef = doc(db, "users", userInfo.uid);
                const userDocSnap = await getDoc(userDocRef);

                if (userDocSnap.exists()) {
                    const firestoreUserData = userDocSnap.data();
                    context.updateUserInfo(firestoreUserData);
                }
            } catch (error) {
                console.error("Error syncing user profile:", error);
            }
        };

        if (userInfo.uid) {
            syncUserProfile();
        }
    }, [userInfo.uid, context]);
    return (
        <>
            <div className="flex flex-col">
                <div className="w-[100%] relative h-[12rem]  rounded-b-[1.25rem]">
                    <img src={userInfo?.coverPhotoURL || coverPhoto} alt="coverPhoto" className="w-full h-full object-cover" />
                    <button className="absolute top-[1.5rem] left-[1.4rem] flex" onClick={() => navigate("/feed")}>
                        <img src={backArrow} alt="backArrow" className="w-[1.6rem] h-auto" />
                    </button>
                    <div className="absolute bottom-[-20.5%]  z-[101] left-[1rem]">
                        <div className="relative ">
                            <img src={userInfo?.photoURL} referrerPolicy="no-referrer" alt="userPic" className="w-[7rem] bg-white h-[7rem] object-cover rounded-full" />
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
                <p className="text-[1.5rem] leading-[1.75rem] font-extrabold font-karla">{userInfo?.Name || userInfo?.displayName}</p>
                <p className="leading-[1.08rem] mt-[0.62rem] text-[0.875rem] font-kumbh">{userInfo?.description}</p>
                {/* My Posts */}
                <div className="mt-[1.5rem] mb-[1rem]">
                    <p className="font-karla font-semibold text-[1.125rem] leading-[1.3rem] text-[#000]">My Posts</p>
                    <PostsSection />
                </div>
            </div>
            <div onClick={newPost}
                className="rounded-full fixed bottom-[1.75rem] right-[1rem] shadow-lg shadow-[#c3b7b7] flex justify-center items-center  bg-black z-[100] h-[3.125rem] w-[3.125rem]">
                <img src={plusIcon} alt="plusICon" className="w-[1rem] h-[1rem] " />
            </div>

        </>
    )
}
export default UserProfile