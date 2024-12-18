import React from "react";
import { Card, Button, Row, Col, Image } from "react-bootstrap";
import { timeAgo } from "../../utilities/utilityFunctions";
import ShareButton from "../ShareButton/ShareButton";

const FeedCard = ({ creator, createdOn, caption, tags, images, likes, ...props }) => {
    let bgColors = ["#F7EBFF", "#FFFAEE"]
    return (
        <Card className="mb-3 shadow-sm border-0 border-radius-3" style={{ background: bgColors[Math.floor(Math.random() * bgColors.length)] }}>
            <Card.Header>
                <div className="d-flex align-items-center">
                    <div>
                        <Image
                            src={creator.image || "https://via.placeholder.com/150"}
                            roundedCircle
                            alt={`${creator.name}'s profile picture`}
                            className="me-3"
                            style={{ width: "3rem", height: "3rem", objectFit: "cover" }}
                        />
                    </div>
                    <div>
                        <strong className="d-block">{creator.name}</strong>
                        <small className="text-muted">{timeAgo(createdOn)}</small>
                    </div>
                </div>
            </Card.Header>
            <Card.Body>
                <Card.Text>{caption}</Card.Text>
                <div className="mb-2">
                    {tags?.map((tag, index) => (
                        <span key={index} className="text-primary me-2">
                            #{tag}
                        </span>
                    ))}
                </div>
                <Row>
                    {images?.map((img, idx) => (
                        <Col xs={6} key={idx} className="mb-2">
                            <Image src={img} thumbnail />
                        </Col>
                    ))}
                </Row>
            </Card.Body>
            <Card.Footer className="d-flex justify-content-between align-items-center">
                <div>
                    <span>❤️ {likes}</span>
                </div>
                <ShareButton />
            </Card.Footer>
        </Card>
    );
};

export default FeedCard;
