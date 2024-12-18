import React from "react";
import { Button } from "react-bootstrap";
import './FloatingButton.css'
import { FaPlus } from "react-icons/fa";
import floatingButtonSrc from "./../../assets/images/floating_button.svg"
const FloatingButton = ({ onClick }) => {
    return (
        <div className="btn btn-sm brn-dark floating-button position-fixed bottom-0 end-0" onClick={onClick}>
            <img src={floatingButtonSrc}/> 
        </div>
        // <Button
        //     variant="dark"
        //     onClick={onClick}
        //     className="rounded-circle position-fixed d-flex align-items-center justify-content-center"
        //     style={{
        //         width: "60px",
        //         height: "60px",
        //         fontSize: "2rem",
        //         bottom: '2px',
        //         right: '0px',
        //         zIndex: 2,
        //     }}
        // >
            
        // </Button>
    );
};

export default FloatingButton;
