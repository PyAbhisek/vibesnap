import React, { useEffect, useState, useContext, useCallback, useRef } from "react";
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
    const [selectedPostUrl, setSelectedPostUrl] = useState("");

    const videoRefs = useRef(new Map());

    const context = useContext(AppContext);
    if (!context) throw new Error("AppContext must be used within an AppContextProvider");

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

    const share = (postId) => {
        const postUrl = `/post/${postId}`;
        setSelectedPostUrl(postUrl);
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

    // Handle Intersection Observer for Videos
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const video = entry.target;
                    if (entry.isIntersecting) {
                        video.play();
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: 0.5 } // Trigger when 50% of the video is visible
        );

        // Attach observer to all videos
        videoRefs.current.forEach((video) => {
            if (video) observer.observe(video);
        });

        return () => {
            videoRefs.current.forEach((video) => {
                if (video) observer.unobserve(video);
            });
        };
    }, [postData]);

    return (
        <div>
            {postData.map((post, index) => (
                <div
                    className={`border w-auto mr-[1rem] relative px-[0.75rem] h-[21.3rem] mb-[10px] rounded-[1.6rem] flex flex-col ${index % 2 === 0 ? 'bg-[#F7EBFF]' : 'bg-[#FFFAEE]'
                        }`}
                    key={post.id}
                >
                    <div className="flex items-center h-[3.125rem] mt-[0.75rem]">
                        <img
                            src={post?.profilePicture}
                            alt="Pic"
                            loading="lazy"
                            className="w-[3.125rem] h-[3.125rem] object-cover rounded-full"
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
                            {post?.description.split("#")?.[0]}
                        </p>
                        <div className="min-h-[0.93rem]">
                            {
                                post?.description
                                    .match(/#[^\s#]+/g)
                                    ?.map((hashtag, index) => (
                                        <span
                                            key={index}
                                            className="text-[0.75rem] font-kumbh leading-[0.93rem] text-[#3C8DFF] mr-1"
                                        >
                                            {hashtag}
                                        </span>
                                    ))
                            }
                        </div>


                    </div>
                    <div className="flex gap-2 overflow-x-auto no-scrollbar">
                        {post?.mediaFiles?.map((media, index) => (
                            isVideo(media) ? (
                                <video
                                    key={index}
                                    ref={(el) => videoRefs.current.set(`${post.id}-${index}`, el)}
                                    src={media}
                                    className="w-[100%] h-[10.5rem] shrink-0 object-cover bg-white rounded-[0.75rem]"
                                    muted
                                    loop
                                />
                            ) : (
                                <img
                                    key={index}
                                    src={media}
                                    loading="lazy"
                                    alt={`media-${index}`}
                                    className="w-[100%] h-[10.5rem] shrink-0 object-cover bg-white rounded-[0.75rem]"
                                />
                            )
                        ))}
                    </div>
                    <div className="mt-[1rem] flex h-auto justify-between items-center">
                        <div className="flex">
                            <img src={filledHearIcon} alt="dp" className="w-[1.1rem]" />
                            <p className="ml-[0.25rem] font-kumbh font-semibold text-[0.75rem] leading-[0.93rem] text-[#D95B7F]">
                                {post?.likes}
                            </p>
                        </div>
                        <div
                            onClick={() => share(post.id)}
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

            {showSharePopup && <SharePopup onClose={() => setShowSharePopup(false)} postUrl={selectedPostUrl} />}

            {loading && <div className="text-center my-4">Loading more posts...</div>}
            {!hasMore && <div className="text-center my-4">No more posts to load</div>}
        </div>
    );
};

export default FeedPosts;
