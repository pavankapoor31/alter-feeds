import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const WelcomeHeader = ({ username, image }) => {
    const navigate = useNavigate();
    const navigateToProfile = ()=>{
        navigate('/profile')
    }
    return (
        <Container className="py-3 px-0">
            <div className="d-flex gap-2 align-items-center" role="button" onClick={navigateToProfile}>
                <div className="">
                    <img
                        src={image}
                        alt="Profile Pic"
                        className="rounded-circle"
                        style={{maxWidth:'3.5rem',maxHeight:'3.5rem'}}
                    />
                </div>
                <div>
                    <div className="text-secondary kumbh-sans-400 fs-6">Welcome Back,</div>
                    <h5 className="m-0">{username}</h5>
                </div>
            </div>
        </Container>
    );
};

export default WelcomeHeader;
