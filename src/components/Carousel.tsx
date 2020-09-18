import React, { useState, useEffect } from 'react';
import './Carousel.css';

export interface CarouselProps {
    imageUrls: string[];
}

export const Carousel = (props: CarouselProps) => {
    const { imageUrls } = props;
    const [currentIndex, setCurrentIndex] = useState(0);

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
        if (imageUrls.length <= 1) {
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

    return imageUrls.length > 0 ? (
        <div className="overlay-content">
            {displayControls()}
            <img src={imageUrls[currentIndex]} alt="" />
        </div>
    ) : null;
};
