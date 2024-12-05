import { useContext } from "react"
import { AppContext } from "../Context/AppContextProvider"
import coverPhoto from "../Assests/userDummyCoverPhoto.svg"
import backArrow from "../Assests/backArrow.svg"
import editPen from "../Assests/EditPen.svg"
import pencil from "../Assests/pencil.svg"
const UserProfile = () => {
    const context = useContext(AppContext)
    if (!context) {
        throw new Error("AppContext must be used within a AppContextProvider");
    }
    const { userInfo } = context
    console.log(userInfo, "userInfo")
    const backToProfile = () => {
        console.log("back")
    }
    const editCoverPic = () => {
        console.log("edit")
    }
    const editProfilePic = () => {
        console.log("edit profile")
    }

    return (
        <>
            <div className="flex flex-col">
                <div className="w-[100%] relative h-[30%] rounded-b-[1.25rem]">
                    <img src={coverPhoto} alt="coverPhoto" className="  h-[30%] w-[100%]" />

                    <button onClick={backToProfile} className="flex cursor-pointer justify-center absolute items-center top-[1.5rem] left-[1.4rem]">
                        <img src={backArrow} alt="backArrow" className="w-[1.6rem] h-auto" />
                        <p className="font-extrabold font-karla leading-[1.46rem] text-[1.25rem] text-white ml-[0.8rem]">Edit Profile</p>
                    </button>
                    <button onClick={editCoverPic} className=" absolute cursor-pointer flex justify-center items-center bottom-[0.5rem] right-[1rem] bg-[#f4f4f4] rounded-full w-[1.68rem] h-[1.68rem]">
                        <img src={pencil} alt="pencil" className="w-[0.81rem]" />
                    </button>

                    {/* profile pic */}
                    <div className="absolute bottom-[-20.5%] z-[101] left-[1rem]">
                        <div className="relative">
                            <img src={userInfo?.photoURL} referrerPolicy="no-referrer" alt="userPic" className="w-[7rem] h-[7rem] rounded-full" />
                            <button onClick={editProfilePic} className=" absolute cursor-pointer flex justify-center items-center bottom-[1rem] right-[-0.1rem] bg-[#f4f4f4] rounded-full w-[1.68rem] h-[1.68rem]">
                                <img src={pencil} alt="pencil" className="w-[0.81rem]" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-[3.75rem] flex justify-center ">

                <div className="flex flex-col w-[90%] justify-center items-start">
                    <p className="text-[0.87rem] leading-[1.24rem] font-kumbh">Name</p>
                    <input type="text" name="name" value={userInfo?.displayName} className="border-b-[0.4px]  w-full border-black text-[0.87rem]  font-semibold leading-[1.24rem] font-kumbh" />

                    <p className="mt-[1.05rem] text-[0.87rem] leading-[1.24rem] font-kumbh">Bio</p>
                    <input type="text" name="bio" className="border-b-[0.4px]  w-full border-black text-[0.87rem] leading-[1.24rem] font-semibold  font-kumbh" />
                </div>

            </div>
            <div className="absolute top-[90%] left-0 right-0 flex justify-center items-center">
                <button className="bg-[#000] text-white px-[1rem] py-[0.31rem] font-karla h-[3rem] font-bold rounded-[2.25rem] w-[20.5rem]">
                    SAVE
                </button>
            </div>

        </>
    )
}

export default UserProfile