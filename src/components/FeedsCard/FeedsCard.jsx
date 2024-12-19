import React, { useContext, useEffect, useRef, useState } from "react";
import { Card, Button, Row, Col, Image } from "react-bootstrap";
import { timeAgo } from "../../utilities/utilityFunctions";
import ShareButton from "../ShareButton/ShareButton";
import SharePost from "../SharePost/SharePost";
import { FaHeart, FaTrashAlt } from "react-icons/fa";
import "./FeedsCard.css"
import { AuthContext } from "../AppContext/AppContext";
import { fetchUserDetails } from "../../api/api";
const FeedCard = ({ creator, createdOn, caption, tags, files, likes, type, id, deletePost, likePost,allowDelete=true }) => {
    const { userData } = useContext(AuthContext);
    let bgColors = ["#F7EBFF", "#FFFAEE"]
    const [showSharePost, setShowSharePost] = useState(false);
    const [creatorDetails, setCreatorDetails] = useState({name:"",image:"",id:""});
    
    useEffect( ()=>{
        const getUserDetails = async ()=>{
            let details = await fetchUserDetails(creator.id);
            console.log(details,'details')
            setCreatorDetails(details);
        }
        if(creator?.id)
        getUserDetails();
    },[creator])
    const videoRefs = useRef([]);
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
            { threshold: 0.5 } // Play the video when at least 50% of it is visible
        );

        videoRefs.current.forEach((video) => {
            if (video) observer.observe(video);
        });

        return () => {
            videoRefs.current.forEach((video) => {
                if (video) observer.unobserve(video);
            });
        };
    }, [id]);

    return (
        <>
            {showSharePost && <SharePost isShareOpen={showSharePost} setIsShareOpen={setShowSharePost} postId={id} />}
            <Card className="mb-3 border-0 border-radius-2 hover-card" style={{ background: bgColors[Math.floor(Math.random() * bgColors.length)] }}>
                <Card.Header className="bg-transparent d-flex justify-content-between align-items-center border-0">
                    <div className="d-flex align-items-center">
                        <div>
                            <Image
                                src={creatorDetails.image || "https://via.placeholder.com/150"}
                                roundedCircle
                                alt={`${creatorDetails.name}'`}
                                className="me-3"
                                style={{ width: "3rem", height: "3rem", objectFit: "cover" }}
                            />
                        </div>
                        <div>
                            <strong className="d-block">{creatorDetails.name}</strong>
                            <small className="text-muted">{timeAgo(createdOn)}</small>
                        </div>
                    </div>
                    {userData?.uid === creator?.id && allowDelete && <div className="delete-icon">
                        <FaTrashAlt
                            onClick={() => deletePost(id)}
                            className="text-danger cursor-pointer"
                            style={{ fontSize: "1.25rem" }}
                            title="Delete Post"
                        />
                    </div>}
                </Card.Header>
                <Card.Body className="border-0 card-content">
                    <Card.Text className="border-0">{caption}</Card.Text>
                    <div className="mb-2">
                        {tags?.map((tag, index) => (
                            <span key={index} className="text-primary me-2">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <div className="d-flex flex-wrap gap-2">
                        {files?.map((img, idx) => (
                            <div className="mb-2">
                                {
                                    type === "image" ? <Image src={img} thumbnail className="border-radius-1" style={{width:"12rem"}} />
                                        : <video className="w-100" ref={(el) => (videoRefs.current[idx] = el)} src={img} controls muted />
                                }
                            </div>
                        ))}
                    </div>
                </Card.Body>
                <Card.Footer className="d-flex justify-content-between align-items-center bg-transparent border-0">
                    <div onClick={() => {if(likePost)likePost(id, userData.uid)}} role="button">
                        <span className="heard-red"> <FaHeart/> <span className="px-1 d-inline-block">{likes?.length || 0}</span></span>
                    </div>
                    <ShareButton onClick={() => setShowSharePost(true)} />
                </Card.Footer>
            </Card>
        </>
    );
};

export default FeedCard;
