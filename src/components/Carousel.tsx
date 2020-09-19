import React, { useState, useEffect } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import './Carousel.css';

export interface CarouselProps {
    imageUrls: string[];
    setUrls: (urls: string[]) => void;
    setEditingMode: (edit: boolean) => void;
    inEditMode: boolean;
}

export const Carousel = (props: CarouselProps) => {
    const { imageUrls, inEditMode } = props;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [newUrls, setNewUrls] = useState<string[]>([]);

    const displayImage = (value: number) => {
        let index = currentIndex + value;
        if (index < 0) {
            index = imageUrls.length - 1;
        } else if (index >= imageUrls.length) {
            index = 0;
        }
        setCurrentIndex(index);
    };

    useEffect(() => {
        if (inEditMode || imageUrls.length <= 1) {
            return;
        }

        const timeoutId = setTimeout(() => {
            displayImage(+1);
        }, 5000);

        return () => {
            clearTimeout(timeoutId);
        };
    });

    const displayImageIndicators = () => {
        return imageUrls.map((el, index) => {
            return (
                <span
                    key={index}
                    className={
                        index === currentIndex
                            ? 'carousel-dot selected-dot'
                            : 'carousel-dot'
                    }
                >
                    &#9679;
                </span>
            );
        });
    };

    const displayControls = () => {
        if (imageUrls.length > 1) {
            return (
                <div className="carousel-controls">
                    <div
                        className="carousel-arrow case-left"
                        onClick={() => {
                            displayImage(-1);
                        }}
                    >
                        &#9656;
                    </div>
                    <div className="dots">{displayImageIndicators()}</div>
                    <div
                        className="carousel-arrow case-right"
                        onClick={() => {
                            displayImage(+1);
                        }}
                    >
                        &#9656;
                    </div>
                </div>
            );
        }
    };

    function handleSave() {
        props.setUrls([...imageUrls, ...newUrls]);
        props.setEditingMode(false);
        setNewUrls([]);
    }

    function displayAddForm() {
        return (
            <div>
                <InputGroup className="mb-3">
                    <FormControl
                        placeholder="Image URL"
                        aria-label="Image URL"
                        aria-describedby="basic-addon2"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                    />
                    <InputGroup.Append>
                        <Button
                            variant="secondary"
                            onClick={() => {
                                setNewUrls([...newUrls].concat(newImageUrl));
                                setNewImageUrl('');
                            }}
                            disabled={!newImageUrl}
                        >
                            Add
                        </Button>
                        <Button
                            variant="success"
                            onClick={handleSave}
                            disabled={newUrls.length === 0}
                        >
                            Save
                        </Button>
                        <Button
                            variant="danger"
                            onClick={() => {
                                setNewUrls([]);
                                props.setEditingMode(false);
                            }}
                        >
                            Discard
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
                <ListGroup>
                    {newUrls.map((url, i) => {
                        return (
                            <ListGroup.Item key={i} as="li" variant="dark">
                                {url}{' '}
                                <Button
                                    size="sm"
                                    variant="outline-danger"
                                    onClick={() => {
                                        const updated = [...newUrls];
                                        updated.splice(i, 1);
                                        setNewUrls(updated);
                                    }}
                                >
                                    Delete
                                </Button>
                            </ListGroup.Item>
                        );
                    })}
                    {!!imageUrls &&
                        imageUrls.map((url, i) => {
                            return (
                                <ListGroup.Item key={i} as="li" variant="info">
                                    {url}{' '}
                                    <Button
                                        size="sm"
                                        variant="outline-danger"
                                        onClick={() => {
                                            const updated = [...imageUrls];
                                            updated.splice(i, 1);
                                            props.setUrls(updated);
                                        }}
                                    >
                                        Delete
                                    </Button>
                                </ListGroup.Item>
                            );
                        })}
                </ListGroup>
            </div>
        );
    }

    return inEditMode ? (
        displayAddForm()
    ) : (
        <div className="overlay-content">
            {displayControls()}
            <img
                src={imageUrls[currentIndex]}
                alt=""
                onClick={() => {
                    props.setEditingMode(true);
                }}
            />
        </div>
    );
};
