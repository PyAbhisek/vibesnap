import React, { useState, useEffect } from 'react';

const PostsSection = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('/api/posts');
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="grid grid-cols-2 gap-4 border h-[50vh]">
            {posts.map((post, index) => (
                <div
                    key={index}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                    {post.type === 'design-meet' && (
                        <div className="relative h-48">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                            <div className="absolute top-4 left-4 bg-white py-1 px-2 rounded-full text-sm">
                                1/2
                            </div>
                        </div>
                    )}
                    {post.type === 'working-on-b2b' && (
                        <div className="h-48 flex items-center justify-center">
                            <img src={post.image} alt={post.title} className="max-h-full max-w-full" />
                        </div>
                    )}
                    {post.type === 'parachute' && (
                        <div className="relative h-48">
                            <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
                        </div>
                    )}
                    <div className="p-4">
                        <h3 className="text-lg font-medium">{post.title}</h3>
                        <div className="flex items-center mt-2">
                            <span className="text-gray-500 text-sm">{post.likes} likes</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PostsSection;