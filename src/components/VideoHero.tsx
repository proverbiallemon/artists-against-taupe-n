import React, { useRef, useEffect, useState } from 'react';

interface VideoHeroProps {
  children: React.ReactNode;
  className?: string;
}

const VideoHero: React.FC<VideoHeroProps> = ({ children, className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  // Intersection Observer to pause video when not in view
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (entry.isIntersecting) {
              videoRef.current.play().catch(() => {
                // Autoplay might be blocked
              });
            } else {
              videoRef.current.pause();
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      if (videoRef.current) {
        observer.unobserve(videoRef.current);
      }
    };
  }, []);

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <section className={`relative overflow-hidden ${className}`}>
      {/* Video Background */}
      {!prefersReducedMotion && (
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              isVideoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            autoPlay
            muted
            loop
            playsInline
            poster="https://images.artistsagainsttaupe.com/videos/hero-video-poster.jpg"
            onLoadedData={() => {
              console.log('Video loaded successfully');
              setIsVideoLoaded(true);
            }}
            onError={(e) => {
              console.error('Video loading error:', e);
            }}
          >
            <source 
              src="https://images.artistsagainsttaupe.com/videos/hero-video-mobile.mp4" 
              type="video/mp4"
              media="(max-width: 768px)"
            />
            <source 
              src="https://images.artistsagainsttaupe.com/videos/hero-video.webm" 
              type="video/webm"
            />
            <source 
              src="https://images.artistsagainsttaupe.com/videos/hero-video.mp4" 
              type="video/mp4"
            />
          </video>
          
          {/* Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"></div>
        </div>
      )}

      {/* Fallback for reduced motion */}
      {prefersReducedMotion && (
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.artistsagainsttaupe.com/videos/hero-video-poster.jpg"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/40"></div>
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </section>
  );
};

export default VideoHero;