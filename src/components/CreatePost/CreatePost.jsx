import React, { useState, useRef, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Camera } from "react-camera-pro";
import { toast } from "react-toastify";
import { FaImage, FaVideo, FaCamera, FaTrash, FaTrashAlt } from "react-icons/fa"; // Import Icons\
import Slider from "react-slick"; // Image Slider
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./CreatePost.css"
import { db ,storage} from "../../_auth/firebaseConfig"
import { Button } from "react-bootstrap";
import { collection, addDoc } from "firebase/firestore"; // Firestore methods
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Firebase storage
import { AuthContext } from "../AppContext/AppContext";
import {v4} from 'uuid'
import { toastConfig } from "../../config/config";
const CreatePost = () => {
    const camera = useRef(null);
    const [caption, setCaption] = useState("");
    const [photos, setPhotos] = useState([]);
    const [video, setVideo] = useState(null);
    const [showCamera, setShowCamera] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [images, setImages] = useState([]);
    const navigate = useNavigate();
    const {user,userData}= useContext(AuthContext);
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    useEffect(() => {
        if (photos && photos.length > 0) {
            const imageUrls = photos.map((file) => URL.createObjectURL(file));
            setImages(imageUrls);
        }
    }, [photos]);

    const handlePhotoUpload = (e) => {
        if (video) {
            toast.error("Cannot upload photos with a video.",toastConfig);
            return;
        }
        if (e.target.files) setPhotos((prev) => {
            const newPhotos = [...prev, ...e.target.files];
            return newPhotos
        });
    };

    const handleVideoUpload = (e) => {
        if (photos.length > 0 || capturedImage) {
            toast.error("Cannot upload video with photos",toastConfig);
            return;
        }
        if (e.target.files) setVideo(e.target.files[0]);
    };

    const handleCameraCapture = () => {
        if (video) {
            toast.error("Cannot use camera with a video",toastConfig);
            return;
        }

        const image = camera.current?.takePhoto();
        if (image) setCapturedImage(image);
        setShowCamera(false);
    };

    const postCollectionRef = collection(db, "posts");
    const createPost = async (postData) => {
        try {
            const newPost = await addDoc(postCollectionRef, postData);
            return newPost.id;
        } catch (err) {
            console.error("Error posting the post:", err);
            throw err;
        }
    };

    const handleSubmit = async () => {
        if (!caption && images.length === 0 && !video && !capturedImage) {
            toast.error( "Add content to post.",toastConfig)
            return;
        }

        try {
            const files = [];
            const fileURLs = [];

            // Upload images to Firebase storage
            if (images.length > 0) {
                for (const image of photos) {
                    // const blob = await fetch(image).then((res) => res.blob());
                    const file = image;
                    files.push(file);
                    // Upload to storage
                    const storageRef = ref(storage, `files/${v4()}/${file.name}`);
                    let res =  await uploadBytes(storageRef, file);
                    const downloadURL = await getDownloadURL(storageRef);
                    fileURLs.push(downloadURL);
                }
            }

            // Upload video to Firebase storage
            if (video) {
                const file = video;
                files.push(file);
                // Upload to storage
                const storageRef = ref(storage, `files/${v4()}/${file.name}`);
                let res =  await uploadBytes(storageRef, file);
                const downloadURL = await getDownloadURL(storageRef);
                fileURLs.push(downloadURL);
            }

            // Upload camera capture to Firebase storage
            if (capturedImage) {
                const captureFile = new File([capturedImage], `capture-${Date.now()}.jpeg`, { type: "image/jpeg" });
                files.push(captureFile);

                const captureRef = ref(storage, `posts/${captureFile.name}`);
                await uploadBytes(captureRef, captureFile);
                const captureURL = await getDownloadURL(captureRef);
                fileURLs.push(captureURL);
            }

            const postData = {
                creator: {
                    id: userData.uid,
                    name: userData.name,
                    image: userData.image,
                },
                caption,
                files: fileURLs, // Store uploaded file URLs
                type: video ? "video" : "image",
                createdOn: new Date().toISOString(),
                likes: 0,
            };
            // Save post data to Firestore
            const postId = await createPost(postData);

            // Navigate to home or desired page
            toast.success("🎉 Posted successfully!",toastConfig)
            navigate(`/`);
        } catch (err) {
            console.error("Error posting the post:", err);
            toast.error( "Failed to post. Please try again.",toastConfig)
        }
    };

    const navigateHome = ()=>{
        navigate("/home")
    }
    return (
        <div className="create-post-container">
            {/* Header */}
            <div className="header" onClick={navigateHome} role="button" >
                <h4>&larr; New post</h4>
            </div>

            {photos.length > 0 && (
                <>
                    <div className="image-slider pb-4">
                        <Slider {...sliderSettings}>
                            {photos.map((photo, index) => (
                                <div key={index} className="slide">
                                    <img src={URL.createObjectURL(photo)} alt={`uploaded-${index}`} style={{ maxWidth: 'calc(100% - 20px)', maxHeight: '50vh' }} />
                                    <div style={{ position: "absolute", bottom: "0px", "right": "0px" }}>
                                        <Button onClick={() => {
                                            setPhotos(photos.filter((_, i) => i !== index));
                                        }} className="bg-transparent text-black border-0"
                                            role="button">
                                                <FaTrashAlt/>
                                            </Button>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                    <label>
                        <FaImage className="icon" style={{ color: "green" }} />
                        <input type="file" accept="image/*" multiple hidden onChange={handlePhotoUpload} disabled={!!video} />
                        <span className="px-2">Add more photos</span>
                    </label>
                </>
            )}

            {/* Captured Image Preview */}
            {capturedImage && (
                <div className="preview-image">
                    <img src={capturedImage} alt="Captured" />
                </div>
            )}

            {/* Video Preview */}
            {video && (
                <div className="preview-video overflow-hidden w-100">
                    <video controls className="w-100" style={{ objectFit: "cover" }}>
                        <source src={URL.createObjectURL(video)} type="video/mp4" />
                    </video>
                </div>
            )}

            {/* Caption Input */}
            <div className="caption-box">
                <textarea
                    placeholder="What's on your mind?"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                ></textarea>
            </div>

            {/* Buttons for Photos, Video, and Camera */}
            {!video && !photos.length && <div className="media-options">
                <label>
                    <FaImage className="icon" style={{ color: "green" }} />
                    <input type="file" accept="image/*" multiple hidden onChange={handlePhotoUpload} disabled={!!video} />
                    <span>{photos.length ? "Add more photos" : "Photos"}</span>
                </label>
                <><label>
                    <FaVideo className="icon" style={{ color: "red" }} />
                    <input type="file" accept="video/*" hidden onChange={handleVideoUpload} disabled={photos.length > 0 || capturedImage} />
                    <span>Video</span>
                </label>
                    <button onClick={() => setShowCamera(true)} disabled={!!video} className="camera-button bg-transparent border-0">
                        <FaCamera className="icon" style={{ color: "blue" }} />
                        <span>Camera</span>
                    </button>
                </>
            </div>}

            {/* Show Camera */}
            {showCamera && (
                <div className="camera-container">
                    <Camera ref={camera} aspectRatio={16 / 9} />
                    <button onClick={handleCameraCapture} className="capture-btn">
                        Capture
                    </button>
                </div>
            )}

            {/* Captured Image Preview */}
            {capturedImage && (
                <div className="preview-image">
                    <img src={capturedImage} alt="Captured" />
                </div>
            )}

            {/* Create Button */}
            <button className="create-button" onClick={handleSubmit}>
                CREATE
            </button>
        </div>
    );
};

export default CreatePost;
