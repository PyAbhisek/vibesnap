import { useContext, useState } from "react";
import { AppContext } from "../Context/AppContextProvider";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, updateDoc } from "firebase/firestore";
import coverPhoto from "../Assests/userDummyCoverPhoto.svg";
import backArrow from "../Assests/backArrow.svg";
import pencil from "../Assests/pencil.svg";
import { db, storage } from "../Services/Firebase";
import { useNavigate } from "react-router-dom";
const EditProfile = () => {
    const context = useContext(AppContext);
    const [userInput, setUserInput] = useState({});
    const [coverPhotoFile, setCoverPhotoFile] = useState(null);
    const [profilePhotoFile, setProfilePhotoFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate()

    if (!context) {
        throw new Error("AppContext must be used within a AppContextProvider");
    }

    const { userInfo } = context;

    const handleImageUpload = async (file, path) => {
        const storageRef = ref(storage, path);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        console.log(url, "url")
        return url;
    };

    const saveData = async () => {
        setIsLoading(true);
        try {
            const updatedData = {
                displayName: userInput.name || userInfo.displayName,
                bio: userInput.bio || userInfo.bio,
                photoURL: profilePhotoFile ? await handleImageUpload(profilePhotoFile, `profilePics/${profilePhotoFile.name}`) : userInfo.photoURL,
                coverPhotoURL: coverPhotoFile ? await handleImageUpload(coverPhotoFile, `coverPics/${coverPhotoFile.name}`) : userInfo.coverPhotoURL,
            };

            const userRef = doc(db, "users", userInfo.uid);
            await updateDoc(userRef, updatedData);
            alert("Profile updated successfully!");
        } catch (error) {
            console.error("Error updating profile:", error);
            alert("Failed to update profile.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (type === "cover") {
            setCoverPhotoFile(file);
        } else if (type === "profile") {
            setProfilePhotoFile(file);
        }
    };

    return (
        <>
            <div className="flex flex-col">
                <div className="w-[100%] relative h-[30%] rounded-b-[1.25rem]">
                    <img src={userInfo.coverPhotoURL || coverPhoto} alt="coverPhoto" className="h-[30%] w-[100%]" />
                    <button className="absolute top-[1.5rem] left-[1.4rem] flex" onClick={() => navigate("/profile")}>
                        <img src={backArrow} alt="backArrow" className="w-[1.6rem] h-auto" />
                        <p className="font-extrabold font-karla leading-[1.46rem] text-[1.25rem] text-white ml-[0.8rem]">Edit Profile</p>
                    </button>
                    <button onClick={() => document.getElementById("coverPicInput").click()} className="absolute flex justify-center items-center bottom-[0.5rem] right-[1rem] bg-[#f4f4f4] rounded-full w-[1.68rem] h-[1.68rem]">
                        <img src={pencil} alt="pencil" className="w-[0.81rem]" />
                    </button>
                    <input type="file" id="coverPicInput" className="hidden" onChange={(e) => handleFileChange(e, "cover")} />

                    <div className="absolute bottom-[-20.5%] z-[101] left-[1rem]">
                        <div className="relative">
                            <img src={userInfo.photoURL} referrerPolicy="no-referrer" alt="userPic" className="w-[7rem] h-[7rem] rounded-full" />
                            <button onClick={() => document.getElementById("profilePicInput").click()} className="absolute bottom-[1rem] right-[-0.1rem] flex justify-center items-center bg-[#f4f4f4] rounded-full w-[1.68rem] h-[1.68rem]">
                                <img src={pencil} alt="pencil" className="w-[0.81rem]" />
                            </button>
                        </div>
                    </div>
                    <input type="file" id="profilePicInput" className="hidden" onChange={(e) => handleFileChange(e, "profile")} />
                </div>
            </div>

            <div className="mt-[3.75rem] flex justify-center">
                <div className="flex flex-col w-[90%] justify-center items-start">
                    <p className="text-[0.87rem] leading-[1.24rem] font-kumbh">Name</p>
                    <input
                        type="text"
                        name="name"
                        value={userInput.name || userInfo.displayName}
                        onChange={(e) => setUserInput({ ...userInput, name: e.target.value })}
                        className="border-b-[0.4px] w-full border-black text-[0.87rem] font-semibold leading-[1.24rem] font-kumbh"
                    />

                    <p className="mt-[1.05rem] text-[0.87rem] leading-[1.24rem] font-kumbh">Bio</p>
                    <input
                        type="text"
                        name="bio"
                        value={userInput.bio || userInfo.bio}
                        onChange={(e) => setUserInput({ ...userInput, bio: e.target.value })}
                        className="border-b-[0.4px] w-full border-black text-[0.87rem] leading-[1.24rem] font-semibold font-kumbh"
                    />
                </div>
            </div>

            <div className="absolute top-[90%] left-0 right-0 flex justify-center items-center">
                <button onClick={saveData} disabled={isLoading} className="bg-[#000] text-white px-[1rem] py-[0.31rem] font-karla h-[3rem] font-bold rounded-[2.25rem] w-[20.5rem]">
                    {isLoading ? "Saving..." : "SAVE"}
                </button>
            </div>
        </>
    );
};

export default EditProfile;
