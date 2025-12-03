import { useRef, useEffect } from 'react';

export const BackgroundVideo = ({ isDayTheme }) => {
  const videoRef = useRef(null);
  const hasPlayedRef = useRef(false); // Track if video has started playing

  const videoSrc = isDayTheme
    ? "https://www.megazone.com/images/main/video/ai_native.mp4"
    : "https://www.megazone.com/images/main/video/cloud_native.mp4";

  // Function to attempt playing the video
  const playVideo = () => {
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.currentTime = 0;
      videoRef.current.play()
        .then(() => {
          console.log('Video playing successfully');
          hasPlayedRef.current = true;
        })
        .catch(error => {
          console.log('Video autoplay prevented:', error);
        });
    }
  };

  // Try to play video when source changes
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current;

      const attemptPlay = () => {
        video.currentTime = 0;
        const playPromise = video.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Video autoplayed on load');
              hasPlayedRef.current = true;
            })
            .catch(error => {
              console.log('Autoplay prevented, waiting for user interaction:', error);
            });
        }
      };

      // Try playing when video is ready
      if (video.readyState >= 2) {
        attemptPlay();
      } else {
        video.addEventListener('loadeddata', attemptPlay, { once: true });
        video.addEventListener('canplay', attemptPlay, { once: true });
      }

      return () => {
        video.removeEventListener('loadeddata', attemptPlay);
        video.removeEventListener('canplay', attemptPlay);
      };
    }
  }, [videoSrc]);

  // Add global interaction listeners to play video on first user interaction
  useEffect(() => {
    // Only add listeners if video hasn't played yet
    if (hasPlayedRef.current) return;

    const handleInteraction = () => {
      if (!hasPlayedRef.current) {
        playVideo();
      }
    };

    // Listen to multiple interaction events
    const events = [
      'click', 
      'touchstart', 
      'touchend',
      'mousedown',
      'mousemove', 
      'keydown',
      'scroll'
    ];

    // Add listeners to document for ANY interaction
    events.forEach(event => {
      document.addEventListener(event, handleInteraction, { 
        once: true,  // Remove after first trigger
        passive: true  // Better performance
      });
    });

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleInteraction);
      });
    };
  }, []);

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