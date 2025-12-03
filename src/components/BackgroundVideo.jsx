/**
 * BackgroundVideo Component
 * Displays animated background video that switches between day/night themes
 */
import { useRef, useEffect } from 'react';

export const BackgroundVideo = ({ isDayTheme }) => {
  const videoRef = useRef(null);
  // Select video source based on day/night theme
  const videoSrc = isDayTheme
    ? "https://www.megazone.com/images/main/video/ai_native.mp4"
    : "https://www.megazone.com/images/main/video/cloud_native.mp4";

  // Ensure video plays when source changes or on load
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      // Reset and play video function
      const playVideo = () => {
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log('Video autoplay prevented:', error);
          });
        }
      };

      // Play immediately if already loaded, otherwise wait for load events
      if (video.readyState >= 2) {
        playVideo();
      } else {
        video.addEventListener('loadeddata', playVideo, { once: true });
        video.addEventListener('canplay', playVideo, { once: true });
      }

      return () => {
        video.removeEventListener('loadeddata', playVideo);
        video.removeEventListener('canplay', playVideo);
      };
    }
  }, [videoSrc]);

  return (
    <video
      key={videoSrc}
      ref={videoRef}
      className="absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 z-0"
      src={videoSrc}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
    />
  );
};