import React, { useEffect, useState, useRef } from "react";
import { Props, defaultData } from "./types";

const Video: React.FC<Props> = ({ data = defaultData }) => {
  const { videos = [], delay = 10000, loop = true } = data;
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * videos.length));
  const videoRef = useRef<HTMLVideoElement>(null);

  // Rotate videos on interval
  useEffect(() => {
    if (videos.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
    }, delay);

    return () => clearInterval(interval);
  }, [videos.length, delay]);

  return (
    <video
      key={videos[currentIndex]} // force re-render on change
      ref={videoRef}
      className="Video fullscreen"
      src={videos[currentIndex]}
      autoPlay
      muted
      loop={loop}
      playsInline
    />
  );
};
console.log("Video plugin loaded!")
export default Video;
