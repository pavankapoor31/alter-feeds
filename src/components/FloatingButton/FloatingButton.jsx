import React from "react";
import { Button } from "react-bootstrap";

const FloatingButton = ({ onClick }) => {
    return (
        <Button
            variant="dark"
            onClick={onClick}
            className="rounded-circle position-fixed d-flex align-items-center justify-content-center"
            style={{
                width: "60px",
                height: "60px",
                fontSize: "2rem",
                bottom: '2px',
                right: '0px',
                zIndex: 2,
            }}
        >
            +
        </Button>
    );
};

export default FloatingButton;
