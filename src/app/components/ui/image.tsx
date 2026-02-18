import React, { useState, useRef, useEffect } from 'react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  threshold?: number;
}

export function LazyImage({ 
  src, 
  alt, 
  className, 
  placeholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjNzc3Nzc3Ii8+PC9zdmc+', 
  threshold = 0.1, 
  ...rest 
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, [threshold]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`overflow-hidden ${className}`}>
      {/* 占位符 */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-100">
          <img 
            src={placeholder} 
            alt="Placeholder" 
            className="w-full h-full object-cover" 
          />
        </div>
      )}
      
      {/* 实际图片 */}
      <ImageWithFallback
        ref={imgRef}
        src={isInView ? src : ''}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        onLoad={handleLoad}
        {...rest}
      />
    </div>
  );
}

export default LazyImage;
