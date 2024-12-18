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

const SharePost = ({isShareOpen, setIsShareOpen,postId}) => {
    const [copied, setCopied] = useState(false);
    const [shareLink, setShareLink] = useState("");

    useEffect(()=>{
        if(postId){
            setShareLink(postId?window.location.origin+"/feeds/"+postId:"")
        }
    },[postId])

    const handleCopy = () => {
        navigator.clipboard.writeText(shareLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset the copied state after 2 seconds
    };

    const togglePopup = () => {
        setIsShareOpen((prev)=>!prev);
    };

    const socialMediaLinks = [
        { name: "Twitter", icon: <FaTwitter />, link: "https://twitter.com" },
        { name: "Facebook", icon: <FaFacebook />, link: "https://facebook.com" },
        { name: "Reddit", icon: <FaReddit />, link: "https://reddit.com" },
        { name: "Discord", icon: <FaDiscord />, link: "https://discord.com" },
        { name: "WhatsApp", icon: <FaWhatsapp />, link: "https://whatsapp.com" },
        { name: "Messenger", icon: <FaFacebookMessenger />, link: "https://messenger.com" },
        { name: "Telegram", icon: <FaTelegram />, link: "https://telegram.org" },
        { name: "Instagram", icon: <FaInstagram />, link: "https://instagram.com" },
    ];

    return (
        <div>
            {isShareOpen && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modalContent}>
                        <h4 style={styles.header}>Share post</h4>
                        <div style={styles.iconsContainer}>
                            {socialMediaLinks.map((platform, index) => (
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

                        <div style={styles.pageLinkContainer}>
                            <span style={styles.pageLink}>{shareLink}</span>
                            <button style={styles.copyButton} onClick={handleCopy}>
                                <FaCopy /> {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                        <button style={styles.closeButton} onClick={togglePopup}>
                            Close
                        </button>
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
        display: "flex",
        justifyContent: "center",
        flexWrap: "wrap",
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
