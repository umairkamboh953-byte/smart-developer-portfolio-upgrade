import React, { useState, useEffect } from 'react';
import { resolveImageUrl, getCategoryPlaceholderSvg } from '../utils/imageUtils';

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  category?: string;
  title?: string;
  fallbackSrc?: string;
}

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Website Preview',
  category = 'Website',
  title = '',
  className = '',
  fallbackSrc,
  loading = 'lazy',
  ...props
}) => {
  const [resolvedSrc, setResolvedSrc] = useState<string>(() => resolveImageUrl(src));
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const nextUrl = resolveImageUrl(src);
    setResolvedSrc(nextUrl);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const handleError = () => {
    setHasError(true);
    const fallback = fallbackSrc || getCategoryPlaceholderSvg(category, title || alt);
    setResolvedSrc(fallback);
  };

  const currentSrc = hasError || !resolvedSrc
    ? (fallbackSrc || getCategoryPlaceholderSvg(category, title || alt))
    : resolvedSrc;

  return (
    <img
      src={currentSrc}
      alt={alt}
      loading={loading}
      referrerPolicy="no-referrer"
      onError={handleError}
      onLoad={() => setIsLoaded(true)}
      className={`${className} ${!isLoaded && !hasError ? 'animate-pulse bg-slate-900' : ''}`}
      {...props}
    />
  );
};
