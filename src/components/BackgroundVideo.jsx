import { useRef, useEffect } from 'react';

export const BackgroundVideo = ({ isDayTheme }) => {
  const dayVideoRef = useRef(null);
  const nightVideoRef = useRef(null);
  const hasPlayedRef = useRef({ day: false, night: false });

  const dayVideoSrc = "https://www.megazone.com/images/main/video/ai_native.mp4";
  const nightVideoSrc = "https://www.megazone.com/images/main/video/cloud_native.mp4";

  // Function to attempt playing a specific video
  const playVideo = (videoRef, videoType) => {
    if (videoRef.current && videoRef.current.paused) {
      videoRef.current.currentTime = 0;
      videoRef.current.play()
        .then(() => {
          console.log(`${videoType} video playing successfully`);
          hasPlayedRef.current[videoType] = true;
        })
        .catch(error => {
          console.log(`${videoType} video autoplay prevented:`, error);
        });
    }
  };

  // Try to play day video when it loads
  useEffect(() => {
    if (dayVideoRef.current) {
      const video = dayVideoRef.current;
      const attemptPlay = () => {
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Day video autoplayed on load');
              hasPlayedRef.current.day = true;
            })
            .catch(error => {
              console.log('Day video autoplay prevented:', error);
            });
        }
      };

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
  }, []);

  // Try to play night video when it loads
  useEffect(() => {
    if (nightVideoRef.current) {
      const video = nightVideoRef.current;
      const attemptPlay = () => {
        video.currentTime = 0;
        const playPromise = video.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Night video autoplayed on load');
              hasPlayedRef.current.night = true;
            })
            .catch(error => {
              console.log('Night video autoplay prevented:', error);
            });
        }
      };

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
  }, []);

  // Add global interaction listeners to play videos on first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      if (!hasPlayedRef.current.day) {
        playVideo(dayVideoRef, 'day');
      }
      if (!hasPlayedRef.current.night) {
        playVideo(nightVideoRef, 'night');
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
        once: true,
        passive: true
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
    <>
      {/* Day theme video (ai_native) */}
      <video
        ref={dayVideoRef}
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ease-in-out ${
          isDayTheme ? 'opacity-100 z-0' : 'opacity-0 -z-10'
        }`}
        src={dayVideoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Night theme video (cloud_native) */}
      <video
        ref={nightVideoRef}
        className={`absolute inset-0 w-full h-full object-cover pointer-events-none transition-opacity duration-1000 ease-in-out ${
          !isDayTheme ? 'opacity-100 z-0' : 'opacity-0 -z-10'
        }`}
        src={nightVideoSrc}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />

      {/* Overlay gradient for better readability */}
      <div 
        className={`absolute inset-0 z-[1] transition-opacity duration-1000 ease-in-out pointer-events-none ${
          isDayTheme 
            ? 'bg-gradient-to-b from-blue-500/10 via-transparent to-orange-500/10' 
            : 'bg-gradient-to-b from-slate-900/30 via-transparent to-cyan-900/20'
        }`}
      />
    </>
  );
};
