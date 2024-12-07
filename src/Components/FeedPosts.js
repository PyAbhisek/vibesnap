import React, { useEffect, useState, useContext, useCallback } from "react";
import { AppContext } from "../Context/AppContextProvider";
import filledHearIcon from "../Assests/filledHearIcon.svg";
import shareIcon from "../Assests/shareIcon.svg";
import SharePopup from "./SharePopup";
import { collection, getDocs, query, limit } from "firebase/firestore";
import { db } from "../Services/Firebase";

const FeedPosts = () => {
    const [postData, setPostData] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [showSharePopup, setShowSharePopup] = useState(false);

    const context = useContext(AppContext);
    if (!context) throw new Error("AppContext must be used within a AppContextProvider");


    const fetchPosts = async () => {
        try {
            setLoading(true);
            const userPostsRef = query(collection(db, "universalFeeds"), limit(10));
            const snapshot = await getDocs(userPostsRef);
            const posts = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setAllPosts(posts);
            setPostData(posts.slice(0, 10));
            setLoading(false);
        } catch (error) {
            console.error("Error fetching posts:", error);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const loadMorePosts = useCallback(() => {
        if (loading || !allPosts.length) return;

        setLoading(true);
        setTimeout(() => {
            let nextIndex = currentIndex + 10;
            if (nextIndex >= allPosts.length) {
                nextIndex = 0;
            }

            setPostData((prevData) => [
                ...prevData,
                ...allPosts.slice(nextIndex, nextIndex + 10),
            ]);
            setCurrentIndex(nextIndex);
            setLoading(false);
        }, 200);
    }, [allPosts, currentIndex, loading]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop + 1 >=
                document.documentElement.scrollHeight
            ) {
                loadMorePosts();
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [loadMorePosts]);

    useEffect(() => {
        if (showSharePopup) {
            document.body.classList.add("no-scroll");
        } else {
            document.body.classList.remove("no-scroll");
        }
    }, [showSharePopup]);

    const share = () => {
        setShowSharePopup(true);
    };

    const isVideo = (url) => /\.(mp4|webm|ogg|mov)$/i.test(url);

    const getTimeDifferenceInHours = (timestamp) => {
        if (!timestamp?.seconds) return "";

        const postTime = timestamp.seconds * 1000;
        const currentTime = new Date().getTime();
        const differenceInMs = currentTime - postTime;
        const differenceInHours = Math.floor(differenceInMs / (1000 * 60 * 60));

        return differenceInHours <= 0
            ? "Just now"
            : `${differenceInHours} ${differenceInHours === 1 ? "hour" : "hours"} ago`;
    };


    return (
        <div>
            {postData.map((post) => (
                <div
                    className={`border w-auto mr-[1rem] relative px-[0.75rem] h-[21.3rem] mb-[10px] rounded-[1.6rem] bg-[#F7EBFF] flex flex-col`}
                >
                    <div className="flex items-center h-[3.125rem] mt-[0.75rem]">
                        <img
                            src={post?.profilePicture}
                            alt="Pic"
                            className="w-[3.125rem] h-[3.125rem] rounded-full"
                        />
                        <div className="ml-[0.625rem] flex flex-col">
                            <p className="font-semibold font-karla text-[1rem] leading-[1.16rem] mb-[1px]">
                                {post?.name}
                            </p>
                            <p className="leading-[0.7rem] text-[0.6rem] text-[#00000054] font-kumbh">
                                {getTimeDifferenceInHours(post?.createdAt)}
                            </p>
                        </div>
                    </div>
                    <div className="mt-[0.87rem]">
                        <p className="text-[0.75rem] font-kumbh leading-[0.93rem]">
                            {post?.description}
                        </p>
                        <span className="text-[0.75rem] font-kumbh leading-[0.93rem] text-[#3C8DFF]">
                            #NYC #Travel
                        </span>
                    </div>
                    {isVideo(post.mediaFiles[0]) ? (
                        <video
                            src={post.mediaFiles[0]}
                            className="w-[100%] h-[10.5rem] object-cover bg-white rounded-[0.75rem]"
                            autoPlay
                            muted
                            loop
                        />
                    ) : (
                        <img
                            src={post.mediaFiles[0]}
                            alt="images"
                            className="w-[100%] h-[10.5rem] object-cover bg-white rounded-[0.75rem]"
                        />
                    )}
                    <div className="mt-[1rem] flex h-auto justify-between items-center">
                        <div className="flex">
                            <img src={filledHearIcon} alt="dp" className="w-[1.1rem]" />
                            <p className="ml-[0.25rem] font-kumbh font-semibold text-[0.75rem] leading-[0.93rem] text-[#D95B7F]">
                                {post?.likes}
                            </p>
                        </div>
                        <div
                            onClick={share}
                            className="bottom-[0.75rem] right-[0.75rem] flex bg-[#00000012] rounded-[1.8rem] py-[0.43rem] px-[1.1rem]"
                        >
                            <img src={shareIcon} alt="share" className="w-[1rem]" />
                            <div className="w-[25%] text-[0.875rem] font-karla font-semibold leading-[1rem] ml-[4px]">
                                Share
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {showSharePopup && <SharePopup onClose={() => setShowSharePopup(false)} />}

            {loading && <div className="text-center my-4">Loading more posts...</div>}
            {!hasMore && <div className="text-center my-4">No more posts to load</div>}
        </div>
    );
};

export default FeedPosts;
