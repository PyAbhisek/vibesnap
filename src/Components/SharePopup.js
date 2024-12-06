import discodeIcon from "../Assests/discord.svg"
import Facebook from "../Assests/fb.svg"
import Instagram from "../Assests/insta.svg"
import messanger from "../Assests/messanger.svg"
import reddit from "../Assests/reddit.svg"
import Telegram from "../Assests/telegram.svg"
import WhatsApp from "../Assests/wp.svg"
import twitter from "../Assests/twitter.svg"
import { useState } from "react"
import copy from "../Assests/copy.svg"
const SharePopup = ({ onClose }) => {
    const socialMedia = [
        { name: "Twitter", icon: twitter, bgColor: "#E9F6FB" },
        { name: "Facebook", icon: Facebook, bgColor: "#E7F1FD" },
        { name: "Reddit", icon: reddit, bgColor: "#FDECE7" },
        { name: "Discord", icon: discodeIcon, bgColor: "#ECF5FA" },
        { name: "WhatsApp", icon: WhatsApp, bgColor: "#E7FBF0" },
        { name: "Messenger", icon: messanger, bgColor: "#E5F3FE" },
        { name: "Telegram", icon: Telegram, bgColor: "#E6F3FB" },
        { name: "Instagram", icon: Instagram, bgColor: "#FF40C617" },
    ]
    const [copySuccessfull, setCopySuccessfull] = useState(false)

    const handleCopy = () => {
        setCopySuccessfull(true)
        setTimeout(() => {
            setCopySuccessfull(false)
        }, 1000);
    }
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[1001] flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-[1.3rem] leading-[1.6] font-karla font-extrabold  ">Share post</h2>
                    <div className="rounded-full bg-[#F5F5F5] w-[2rem] h-[2rem] justify-center items-center flex">
                        <button
                            onClick={onClose}
                            className="text-gray-600 hover:text-gray-800"
                        >
                            &times;
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    {socialMedia.map((item) => (
                        <div
                            key={item.name}
                            className="flex flex-col items-center text-center text-sm"
                        >
                            <div style={{ backgroundColor: item.bgColor }}
                                className={`w-[3.5rem] h-[3.5rem] flex flex-col items-center justify-center rounded-full`}>
                                <img src={item.icon} alt={item.name} />
                            </div>
                            <span className="mt-2 font-Kumbh text-[0.75rem] leading-[0.93rem] text-[#696565] ">{item.name}</span>
                        </div>
                    ))}
                </div>

                <div className="mt-6">
                    <label className="block text-gray-700 font-Karla font-semibold  leading-[1.16rem] text-[1rem]">
                        Page Link
                    </label>
                    <div className="flex items-center mt-[0.5rem] border border-gray-300 rounded px-2 py-1">
                        <input
                            type="text"
                            value="https://www.arnav/feed"
                            readOnly
                            className="flex-grow bg-transparent outline-none text-gray-600"
                        />
                        <button onClick={handleCopy} className=" ml-2">
                            <img src={copy} alt="copy" className="w-[1.25rem] h-[1.25rem]" />
                        </button>
                    </div>
                </div>
            </div>
            {copySuccessfull &&
                <div className="absolute top-[5%] left-0 right-0 flex justify-center items-center">
                    <button className="bg-[#000] text-white px-[1rem] rounded-lg font-karla h-[1.5rem] font-bold  w-[20.5rem]">
                        Copied
                    </button>
                </div>}
        </div>
    );
};

export default SharePopup;