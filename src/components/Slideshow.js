import React, { useState, useEffect } from 'react';
import Footer from "@/components/Footer";

export default function Slideshow() {
  const [slideIndex, setSlideIndex] = useState(0);
  const [progress, setProgress] = useState([0, 0, 0]);
  const [disableTransition, setDisableTransition] = useState(false);
  const images = [
    '/images/slideshow1.webp',
    '/images/slideshow2.webp',
    '/images/slideshow3.webp',
  ];

  useEffect(() => {
    console.log('Use Effect');
    const timer = setInterval(() => {
      setSlideIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % images.length;
        if (newIndex === 0) {
          setDisableTransition(true);
          setProgress([0, 0, 0]);
          setTimeout(() => setDisableTransition(false), 50);
        }
        return newIndex;
      });
    }, 5000);
  
    const progressTimer = setInterval(() => {
      setProgress((prevProgress) => {
        const newProgress = [...prevProgress];
        newProgress[slideIndex] = Math.min(newProgress[slideIndex] + 1, 100);
        return newProgress;
      });
    }, 50);  
  
    return () => {
      clearInterval(timer);
      clearInterval(progressTimer);
    };
  }, [images.length, slideIndex]);

  const handleBarClick = (index) => {
    setDisableTransition(true);
    setSlideIndex(index);
    const newProgress = [0, 0, 0];
    for (let i = 0; i <= index; i++) {
      newProgress[i] = i < index ? 100 : 0;
    }
    setProgress(newProgress);
    setTimeout(() => setDisableTransition(false), 50);
  };

  return (
    <div className="slideshow-container relative">
      {images.map((image, index) => (
        <div className={`mySlides ${index === slideIndex ? 'show' : ''}`} key={index}>
          <img src={image} alt={`Slide ${index + 1}`} />
        </div>
      ))}
      <div className="progress-container lg:pb-0 sm:pb-7">
        {images.map((_, index) => (
          <div 
            className={`progress-bar ${disableTransition ? 'no-transition' : ''}`}
            key={index} 
            onClick={() => handleBarClick(index)}
          >
            <div 
              style={{
                width: `${index === slideIndex ? progress[slideIndex] : (index < slideIndex ? 100 : 0)}%`,
                height: '100%',
                backgroundColor: 'white',
                transition: index === slideIndex && !disableTransition ? 'width 0.15s linear' : 'none'
              }}
            ></div>
          </div>
        ))}
      </div>

      <div className={"absolute bottom-6 lg:max-h-[100000000000000000000000000000000px] sm:max-h-0 w-full"}>
        <Footer/>
      </div>

    </div>
  );
}
