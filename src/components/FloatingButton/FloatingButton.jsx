import React from "react";
import { Button } from "react-bootstrap";
import './FloatingButton.css'
import { FaPlus } from "react-icons/fa";
import floatingButtonSrc from "./../../assets/images/floating_button.svg"
const FloatingButton = ({ onClick }) => {
    return (
        <div className="btn btn-sm brn-dark floating-button position-fixed bottom-0" onClick={onClick}>
            <img src={floatingButtonSrc}/> 
        </div>
    );
};

export default FloatingButton;
