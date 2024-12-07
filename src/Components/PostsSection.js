
import {
    collection,
    getDocs,
} from 'firebase/firestore';
import { db } from "../Services/Firebase";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../Context/AppContextProvider";
import heartIcon from "../Assests/greyHeart.svg"
const PostsSection = () => {
    const context = useContext(AppContext);
    const [userFeed, setUserFeed] = useState([])
    if (!context) {
        throw new Error("AppContext must be used within a AppContextProvider");
    }

    const { userInfo } = context;
    const fetchPosts = async () => {
        try {
            const userPostsRef = collection(db, 'users', userInfo.uid, 'posts');
            const snapshot = await getDocs(userPostsRef);
            const postData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUserFeed(postData)
            console.log(postData, "postData")
        } catch (error) {
            console.error("Error fetching posts:", error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const isVideo = (url) => {
        return /\.(mp4|webm|ogg|mov)$/i.test(url);
    };
    return (
        <div className="grid grid-cols-2 gap-[0.75rem] mt-[0.68rem]">
            {userFeed.map((i) => {
                return (
                    <div className=" relative w-full h-[15rem] rounded-[0.75rem] bg-[#ffffff]">
                        {i.mediaFiles.length > 0 && (
                            <div className="absolute top-2 right-2 z-10 bg-white bg-opacity-60 text-black w-auto h-auto px-[7px] py-[3px] rounded-[0.6rem] text-sm font-semibold">
                                1 / {i.mediaFiles.length}
                            </div>
                        )}

                        <p className=' max-w-[80%] truncate absolute bottom-[2rem] left-[0.75rem]  text-white text-[0.875rem] font-semibold font-kumbh leading-[1rem]'>
                            {i.description}
                        </p>

                        <div className=' flex  absolute bottom-[0.75rem] left-[0.75rem]  text-[#706e6e] text-[0.875rem] font-semibold font-kumbh leading-[1rem]'>
                            {i.likes > 0 && <img src={heartIcon} alt="hearticon" className='w-[1rem] h-[1rem]' />}
                            <p className=' ml-[2px]'>{i.likes}</p>
                        </div>
                        {isVideo(i.mediaFiles[0]) ? (
                            <video
                                src={i.mediaFiles[0]}
                                className="h-full w-full rounded-[0.75rem] object-cover"
                                autoPlay
                                muted
                            />
                        ) : (
                            <img
                                src={i.mediaFiles[0]}
                                alt="images"
                                className="h-full w-full rounded-[0.75rem] object-cover"
                            />
                        )}
                    </div>
                )
            })}

        </div >

    );
};

export default PostsSection;
