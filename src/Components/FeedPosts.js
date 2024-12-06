import React, { useEffect, useState, useContext } from "react"
import { AppContext } from "../Context/AppContextProvider";

const FeedPosts = () => {
    const [postData, setPostData] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const context = useContext(AppContext);
    if (!context) {
        throw new Error("AppContext must be used within a AppContextProvider");
    }

    const { userInfo } = context;

    const fetchPosts = async (pageNum) => {
        if (loading) return;
        setLoading(true);

        try {
            const response = await fetch(`https://dummyjson.com/posts?limit=20&skip=${(pageNum - 1) * 20}`);
            const data = await response.json();

            if (data.posts.length === 0) {
                setHasMore(false);
                setPage(1);
            } else {
                setPostData(prevPosts =>
                    pageNum === 1 ? data.posts : [...prevPosts, ...data.posts]
                );
            }
        }
        catch (error) {
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(page);
    }, [page]);

    const handleScroll = () => {
        if (
            window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 100 &&
            hasMore &&
            !loading
        ) {
            setPage(prevPage => prevPage + 1);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [hasMore, loading]);

    return (
        <div>
            {postData.map((post, index) => (
                <div
                    key={post.id}
                    className="border w-auto mr-[1rem] h-[21.3rem] mb-[10px] rounded-[1.6rem] bg-[#F7EBFF] flex flex-col"
                >
                    <div className="flex items-center h-[3.125rem] ml-[0.75rem] mt-[0.75rem]">
                        <img
                            src={userInfo?.photoURL}
                            alt="dp"
                            className="w-[3.125rem] h-[3.125rem] rounded-full"
                        />
                        <div className="ml-[0.625rem] flex flex-col">
                            <p className="font-semibold font-karla text-[1rem] leading-[1.16rem] mb-[1px]">
                                {post.userId}
                            </p>
                            <p className="leading-[0.7rem] text-[0.6rem] font-kumbh">
                                2 Hours
                            </p>
                        </div>
                    </div>
                    <div className="mx-[0.75rem] mt-[0.87rem]">
                        <p className="text-[0.75rem] font-kumbh leading-[0.93rem]">
                            {post.title}
                        </p>
                        <span className="text-[0.75rem] font-kumbh leading-[0.93rem] text-[#3C8DFF]">
                            #NYC #Travel
                        </span>
                    </div>

                    <div>
                    </div>
                </div>
            ))}

            {loading && (
                <div className="text-center my-4">Loading more posts...</div>
            )}

            {!hasMore && (
                <div className="text-center my-4">No more posts to load</div>
            )}
        </div>
    )
}

export default FeedPosts;