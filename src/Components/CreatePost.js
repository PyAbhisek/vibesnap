import backArrow from "../Assests/blackBackArrow.svg";
import { useState, useContext, useRef } from "react";
import { AppContext } from "../Context/AppContextProvider";
import { useNavigate } from "react-router-dom";
import camera from "../Assests/camera.svg";
import { createClient } from '@supabase/supabase-js';
import { db, storage } from "../Services/Firebase";
import { v4 as uuidv4 } from 'uuid';
import {
    collection,
    addDoc,
    serverTimestamp
} from 'firebase/firestore';

const CreatePost = () => {
    const supabase = createClient('https://pwaeuwktlqvupghddpjk.supabase.co', "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB3YWV1d2t0bHF2dXBnaGRkcGprIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NTIxOTAsImV4cCI6MjA0OTEyODE5MH0.R_KZC0A9gFa3Uq0s7qzHZNWHQvFNRCSpBEysyBtDL48");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [postDescription, setPostDescription] = useState('');

    const navigate = useNavigate();

    const context = useContext(AppContext);

    const fileInputRef = useRef(null);

    const handleFileContainerClick = () => {
        fileInputRef.current?.click();
    };

    if (!context) {
        throw new Error("AppContext must be used within a AppContextProvider");
    }

    const { userInfo } = context;
    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setSelectedFiles(files);
        setCurrentSlide(0);
    };

    const handleNextSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % selectedFiles.length);
    };

    const handlePrevSlide = () => {
        setCurrentSlide((prevSlide) => (prevSlide - 1 + selectedFiles.length) % selectedFiles.length);
    };

    const isVideo = (file) => file.type.startsWith("video/");


    const uploadFileToSupabase = async (file) => {
        try {
            const fileExtension = file.name.split('.').pop();
            const fileName = `${uuidv4()}.${fileExtension}`;

            const { data, error } = await supabase.storage
                .from('vibesnap_Pics')
                .upload(fileName, file);

            if (error) {
                console.error('Supabase upload error:', error);
                throw error;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('vibesnap_Pics')
                .getPublicUrl(fileName);

            return publicUrl;
        } catch (error) {
            console.error('File upload error:', error);
            throw error;
        }
    };


    const handleCreatePost = async () => {
        if (!userInfo || !userInfo.uid) {
            alert('Please log in to create a post');
            return;
        }

        if (selectedFiles.length === 0) {
            alert('Please select at least one image or video');
            return;
        }

        setIsLoading(true);

        try {
            // Upload files to Supabase and get URLs
            const mediaUrls = await Promise.all(
                selectedFiles.map(file => uploadFileToSupabase(file))
            );

            // Create post document with fallback values
            const postId = uuidv4();
            const postData = {
                postId,
                userId: userInfo.uid,
                description: postDescription || '',
                mediaFiles: mediaUrls,
                profilePicture: userInfo.photoURL || '',
                name: userInfo.Name || userInfo.displayName || 'Anonymous User',
                likes: 0,
                createdAt: serverTimestamp(),
            };

            // Store in user-specific posts collection
            const userPostRef = collection(db, 'users', userInfo.uid, 'posts');
            await addDoc(userPostRef, postData);

            // Store in universal feeds collection
            const universalFeedsRef = collection(db, 'universalFeeds');
            await addDoc(universalFeedsRef, postData);

            // Reset state and navigate
            setSelectedFiles([]);
            setPostDescription('');
            setIsLoading(false);
            navigate('/profile');

        } catch (error) {
            console.error('Post creation error:', error);
            alert(`Failed to create post: ${error.message}`);
            setIsLoading(false);
        }
    };

    return (
        <>
            <div className="">
                <button
                    className="absolute top-[1.5rem] left-[1.4rem] flex"
                    onClick={() => navigate("/profile")}
                >
                    <img src={backArrow} alt="backArrow" className="w-[1.6rem] h-auto" />
                    <p className="font-extrabold font-karla leading-[1.46rem] text-[1.25rem] ml-[0.8rem]">New Post</p>
                </button>
                <div className="flex items-center justify-center mt-[6rem]">
                    <div className="mx-[2.6rem] w-full flex items-center justify-center aspect-square rounded-[0.75rem] bg-[#d3d3d3] relative overflow-hidden">
                        {selectedFiles.length > 0 && (
                            <div className="absolute top-2 right-2 z-10 bg-white bg-opacity-60 text-black w-auto h-auto px-[7px] py-[3px] rounded-[0.6rem] text-sm font-semibold">
                                {currentSlide + 1} / {selectedFiles.length}
                            </div>
                        )}
                        {selectedFiles.length === 0 ? (
                            <label htmlFor="file-input">
                                <img src={camera} alt="camera" className="w-[5rem] h-auto cursor-pointer" />
                            </label>
                        ) : selectedFiles.length === 1 ? (
                            isVideo(selectedFiles[0]) ? (
                                <video
                                    src={URL.createObjectURL(selectedFiles[0])}
                                    alt="Selected video"
                                    className="w-full h-full object-cover rounded-[0.75rem]"
                                    autoPlay
                                    muted={false}
                                />
                            ) : (
                                <img
                                    src={URL.createObjectURL(selectedFiles[0])}
                                    alt="Selected image"
                                    className="w-full h-full object-cover rounded-[0.75rem]"
                                />
                            )
                        ) : (
                            <div className="w-full h-full relative">
                                {isVideo(selectedFiles[currentSlide]) ? (
                                    <video
                                        src={URL.createObjectURL(selectedFiles[currentSlide])}
                                        alt={`Slide ${currentSlide + 1}`}
                                        className="w-full h-full object-cover rounded-[0.75rem]"
                                        autoPlay
                                        muted={false}
                                    />
                                ) : (
                                    <img
                                        src={URL.createObjectURL(selectedFiles[currentSlide])}
                                        alt={`Slide ${currentSlide + 1}`}
                                        className="w-full h-full object-cover rounded-[0.75rem]"
                                    />
                                )}
                            </div>
                        )}
                        <input
                            // ref={fileInputRef}
                            id="file-input"
                            type="file"
                            accept="image/*, video/*"
                            multiple
                            className="hidden"
                            onChange={handleFileChange}
                        />
                    </div>
                </div>
                <div className="mt-[0.62rem] flex gap-[3px] w-full justify-center items-center">
                    {selectedFiles.length > 1 &&
                        selectedFiles.map((_, index) => (
                            <div
                                key={index}
                                className={`w-[8px] h-[8px] rounded-full cursor-pointer transition-all duration-300
                    ${index === currentSlide ? "bg-black" : "bg-gray-400"}`}
                                onClick={() => setCurrentSlide(index)}
                            />
                        ))}
                </div>
            </div>
            <div className="mt-[1.8rem] flex justify-center">
                <div className="flex flex-col w-[90%] justify-center items-start">
                    <textarea
                        type="text"
                        name="NewPost"
                        placeholder="What's on your mind"
                        value={postDescription}
                        required
                        onChange={(e) => setPostDescription(e.target.value)}
                        className="border-b-[0.4px] w-full border-black text-[0.87rem] leading-[1.24rem] font-semibold font-kumbh"
                    />
                </div>
            </div>
            <div className="absolute top-[90%] left-0 right-0 flex justify-center items-center">
                <button
                    onClick={handleCreatePost}
                    disabled={isLoading}
                    className="bg-[#000] text-white px-[1rem] py-[0.31rem] font-karla h-[3rem] font-bold rounded-[2.25rem] w-[20.5rem]"
                >
                    {isLoading ? "Creating..." : "Create"}
                </button>
            </div>
        </>
    );
};

export default CreatePost;
