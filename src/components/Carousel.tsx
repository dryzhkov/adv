import React, { useState, useEffect, useCallback } from 'react';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import ProgressBar from 'react-bootstrap/ProgressBar';
import Button from 'react-bootstrap/Button';
import './Carousel.css';

export interface CarouselProps {
    imageUrls: string[];
    setUrls: (urls: string[]) => void;
    setEditingMode: (edit: boolean) => void;
    inEditMode: boolean;
}

const IMAGE_TIMEOUT_MS = 5000;

export const Carousel = (props: CarouselProps) => {
    const { imageUrls, inEditMode } = props;
    const [currentIndex, setCurrentIndex] = useState(0);
    const [newImageUrl, setNewImageUrl] = useState('');
    const [progress, setProgress] = useState(0);

    const displayImage = useCallback(
        (value: number) => {
            let index = currentIndex + value;
            if (index < 0) {
                index = imageUrls.length - 1;
            } else if (index >= imageUrls.length) {
                index = 0;
            }
            setCurrentIndex(index);
            setProgress(0);
        },
        [currentIndex, imageUrls.length]
    );

    useEffect(() => {
        if (inEditMode || imageUrls.length <= 1) {
            return;
        }

        const timeoutId = setTimeout(() => {
            displayImage(+1);
        }, IMAGE_TIMEOUT_MS);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [currentIndex, inEditMode, imageUrls.length, displayImage]);

    useEffect(() => {
        if (inEditMode || imageUrls.length <= 1) {
            setProgress(0);
            return;
        }

        const timeoutId = setTimeout(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    return 0;
                }
                return prev + 100 / 4;
            });
        }, IMAGE_TIMEOUT_MS / 5);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [progress, inEditMode, imageUrls.length]);

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

    const displayMainContent = () => {
        if (imageUrls.length) {
            return (
                <>
                    <ProgressBar
                        now={progress}
                        srOnly={true}
                        striped={true}
                        animated={true}
                        variant="dark"
                    ></ProgressBar>
                    <img
                        src={imageUrls[currentIndex]}
                        alt=""
                        onClick={() => {
                            props.setEditingMode(true);
                        }}
                    />
                </>
            );
        }
    };

    function displayAddForm() {
        return (
            <div className="add-img-wrapper">
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
                            variant="dark"
                            onClick={() => {
                                props.setUrls([newImageUrl, ...imageUrls]);
                                setNewImageUrl('');
                            }}
                            disabled={!newImageUrl}
                        >
                            Add
                        </Button>
                    </InputGroup.Append>
                </InputGroup>
                <ul className="image-preview-list">
                    {!!imageUrls &&
                        imageUrls.map((url, i) => {
                            return (
                                <li key={i}>
                                    <img
                                        className="preview-img"
                                        src={url}
                                        alt=""
                                    />
                                    <Button
                                        size="sm"
                                        variant="outline-danger"
                                        className="delete-preview-img"
                                        onClick={() => {
                                            const updated = [...imageUrls];
                                            updated.splice(i, 1);
                                            props.setUrls(updated);
                                        }}
                                    >
                                        X
                                    </Button>
                                </li>
                            );
                        })}
                </ul>
            </div>
        );
    }

    return inEditMode ? (
        displayAddForm()
    ) : (
            <div className="overlay-content">
                {displayControls()}
                {displayMainContent()}
            </div>
        );
};
