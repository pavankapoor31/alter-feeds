import React, { useEffect, useState } from "react";
import {
    FaTwitter,
    FaFacebook,
    FaReddit,
    FaDiscord,
    FaWhatsapp,
    FaFacebookMessenger,
    FaTelegram,
    FaInstagram,
    FaCopy,
} from "react-icons/fa";
import { toastConfig } from "../../config/config";
import { toast } from "react-toastify";
import closeIcon from "./../../assets/images/close_icon.svg"
const SharePost = ({ isShareOpen, setIsShareOpen, postId }) => {
    const [copied, setCopied] = useState(false);
    const [shareLink, setShareLink] = useState("");

    useEffect(() => {
        if (postId) {
            let link = postId ? window.location.origin + "/feeds/" + postId : ""
            setShareLink(link);
            navigator.clipboard.writeText(link);
        }
    }, [postId])

    useEffect(() => {
        if (!shareLink) return;
        navigator.clipboard.writeText(shareLink);
        toast.success("Link copied to clipboard", toastConfig)
    }, [shareLink])
    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        toast.success("Link copied to clipboard", toastConfig)
        setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
    };

    const togglePopup = () => {
        setIsShareOpen((prev) => !prev);
    };
    
    const socialMediaLinks = (postUrl, postText) => [
        {
            name: "Twitter",
            icon: <FaTwitter />,
            link: `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postText)}`,
        },
        {
            name: "Facebook",
            icon: <FaFacebook />,
            link: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`,
        },
        {
            name: "Reddit",
            icon: <FaReddit />,
            link: `https://reddit.com/submit?url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(postText)}`,
        },
        {
            name: "Discord",
            icon: <FaDiscord />,
            link: `https://discord.com/`, // Discord does not have a direct sharing URL
        },
        {
            name: "WhatsApp",
            icon: <FaWhatsapp />,
            link: `https://wa.me/?text=${encodeURIComponent(postText)}%20${encodeURIComponent(postUrl)}`,
        },
        {
            name: "Messenger",
            icon: <FaFacebookMessenger />,
            link: `https://www.facebook.com/dialog/send?link=${encodeURIComponent(postUrl)}&app_id=YOUR_APP_ID`,
        },
        {
            name: "Telegram",
            icon: <FaTelegram />,
            link: `https://t.me/share/url?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postText)}`,
        },
        {
            name: "Instagram",
            icon: <FaInstagram />,
            link: `https://www.instagram.com/`, // Instagram does not have a direct sharing URL
        },
    ];
    

    return (
        <div>
            {isShareOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <div className="d-flex justify-content-between">
                            <div style={styles.header}>Share post</div> 
                            <div onClick={togglePopup}> <img src={closeIcon}/></div>
                        </div>
                        <div style={styles.iconsContainer}>
                            {socialMediaLinks(shareLink,"Check out this post!").map((platform, index) => (
                                <a
                                    key={index}
                                    href={platform.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={styles.iconLink}
                                    title={platform.name}
                                >
                                    {platform.icon}
                                </a>
                            ))}
                        </div>

                        <div className="font-bold">Page link</div>
                        <div style={styles.pageLinkContainer}>
                            <span style={styles.pageLink}>{shareLink}</span>
                            <button className="btn btn-light" onClick={handleCopy}>
                                <FaCopy />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Inline styles for simplicity
const styles = {
    openButton: {
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        padding: "10px 20px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
    modalOverlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: "10px",
        padding: "20px",
        maxWidth: "400px",
        width: "90%",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
    },
    header: {
        fontSize: "18px",
        marginBottom: "15px",
    },
    iconsContainer: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)", /* 4 columns */
        gap: "15px",
        marginBottom: "20px",
    },
    iconLink: {
        fontSize: "28px",
        color: "#555",
        transition: "color 0.3s",
        textDecoration: "none",
    },
    pageLinkContainer: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#f5f5f5",
        padding: "8px 12px",
        borderRadius: "5px",
        fontSize: "14px",
    },
    pageLink: {
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap",
        maxWidth: "70%",
    },
    copyButton: {
        backgroundColor: "#007bff",
        color: "#fff",
        border: "none",
        padding: "5px 10px",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        gap: "5px",
    },
    closeButton: {
        backgroundColor: "#dc3545",
        color: "#fff",
        border: "none",
        padding: "8px 16px",
        borderRadius: "5px",
        cursor: "pointer",
        marginTop: "15px",
    },
};

export default SharePost;
