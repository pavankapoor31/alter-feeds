import React from 'react'
import { Button } from 'react-bootstrap';
import { BiSolidNavigation } from "react-icons/bi";
import "./ShareButton.css"
const ShareButton = ({onClick}) => {
  return (
    <div onClick={onClick}>
        <Button className='share-button' size="sm">
            <BiSolidNavigation/> Share
        </Button>
    </div>
  )
}

export default ShareButton