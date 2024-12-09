import { useContext, useState } from "react";
import { AppContext } from "../Context/AppContextProvider";
import { useNavigate } from "react-router-dom";
import FeedPosts from "./FeedPosts";
import logoutIcon from "../Assests/logout.svg";

const Feed = () => {
    const context = useContext(AppContext);
    const navigate = useNavigate();

    if (!context) {
        throw new Error("AppContext must be used within a AppContextProvider");
    }

    const { userInfo, setUserInfo } = context;

    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    const handleLogout = () => {
        setShowLogoutPopup(true);
    };

    const confirmLogout = () => {
        setUserInfo({});
        localStorage.clear();
        navigate("/");
    };

    const cancelLogout = () => {
        setShowLogoutPopup(false); // Close popup on cancel
    };

    return (
        <>
            <div className="flex items-center justify-between h-[3.125rem] mx-[1rem] mt-[1rem]">
                <div
                    className="flex items-center"
                    onClick={() => {
                        navigate("/profile");
                    }}
                >
                    <img
                        src={userInfo?.photoURL}
                        alt="dp"
                        className="w-[3.125rem] h-[3.125rem] rounded-full object-cover"
                    />
                    <div className="ml-[0.625rem] flex flex-col">
                        <p className="text-[0.625rem] leading-[0.77rem] font-kumbh text-[#00000054]">
                            Welcome Back,
                        </p>
                        <p className="leading-[1.24rem] text-[1rem] font-kumbh font-semibold">
                            {userInfo?.Name || userInfo?.displayName}
                        </p>
                    </div>
                </div>

                <img
                    src={logoutIcon}
                    alt="logoutIcon"
                    onClick={handleLogout}
                    className="w-[1.125rem] h-[1.125rem] cursor-pointer"
                />
            </div>
            <div className="ml-[1rem] mt-[1.9rem]">
                <p className="font-extrabold text-[1.5rem] font-karla leading-[1.75rem] mb-[1.18rem]">
                    Feeds
                </p>
                <FeedPosts />
            </div>

            {showLogoutPopup && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-[20rem]">
                        <p className="text-center font-semibold mb-4 font-karla">
                            Are you sure you want to logout?
                        </p>
                        <div className="flex justify-evenly">

                            <button
                                onClick={cancelLogout}
                                className="bg-gray-300 w-[5rem] font-karla py-[0.5rem] rounded hover:bg-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmLogout}
                                className="bg-[#292929] text-white  font-karla w-[5rem] py-[0.5rem] rounded hover:bg-red-600"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Feed;
