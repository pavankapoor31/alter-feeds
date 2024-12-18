import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const WelcomeHeader = ({ username, image }) => {
    return (
        <Container className="py-3 px-0">
            <div className="d-flex gap-2 align-items-center">
                <div className="">
                    <img
                        src={image}
                        alt="Profile Pic"
                        className="rounded-circle"
                        style={{maxWidth:'4rem',maxHeight:'4rem'}}
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
