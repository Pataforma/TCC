import React, { useState, useRef, useEffect } from "react";
import { FaPaw, FaImage } from "react-icons/fa";

const OptimizedImage = ({
  src,
  alt,
  className = "",
  fallbackIcon = "paw",
  placeholder = null,
  onLoad,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  // Intersection Observer para lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unsubscribe();
        }
      },
      {
        rootMargin: "50px", // Carrega 50px antes de entrar na viewport
        threshold: 0.1,
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unsubscribe();
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    if (onLoad) onLoad();
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(false);
    if (onError) onError();
  };

  const getFallbackIcon = () => {
    switch (fallbackIcon) {
      case "image":
        return <FaImage />;
      case "paw":
      default:
        return <FaPaw />;
    }
  };

  // Se não está na viewport, mostrar placeholder
  if (!isInView) {
    return (
      <div
        ref={imgRef}
        className={`optimized-image-placeholder ${className}`}
        style={{
          backgroundColor: "#f8f9fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--main-color)",
          ...props.style,
        }}
      >
        {getFallbackIcon()}
      </div>
    );
  }

  // Se houve erro, mostrar fallback
  if (hasError) {
    return (
      <div
        className={`optimized-image-error ${className}`}
        style={{
          backgroundColor: "#f8f9fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#6c757d",
          ...props.style,
        }}
      >
        {getFallbackIcon()}
      </div>
    );
  }

  return (
    <div className={`optimized-image-container ${className}`} ref={imgRef}>
      {/* Placeholder enquanto carrega */}
      {!isLoaded && (
        <div
          className="optimized-image-placeholder"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "#f8f9fa",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--main-color)",
            zIndex: 1,
          }}
        >
          {placeholder || getFallbackIcon()}
        </div>
      )}

      {/* Imagem real */}
      <img
        src={src}
        alt={alt}
        className={`optimized-image ${isLoaded ? "loaded" : "loading"}`}
        onLoad={handleLoad}
        onError={handleError}
        loading="lazy"
        {...props}
        style={{
          ...props.style,
          opacity: isLoaded ? 1 : 0,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
    </div>
  );
};

// Componente para imagens de perfil
export const ProfileImage = ({ src, alt, size = "medium", ...props }) => {
  const sizeMap = {
    small: { width: "32px", height: "32px" },
    medium: { width: "48px", height: "48px" },
    large: { width: "64px", height: "64px" },
    xlarge: { width: "96px", height: "96px" },
  };

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fallbackIcon="paw"
      className="rounded-circle"
      style={{
        ...sizeMap[size],
        objectFit: "cover",
      }}
      {...props}
    />
  );
};

// Componente para imagens de pets
export const PetImage = ({ src, alt, size = "medium", ...props }) => {
  const sizeMap = {
    small: { width: "60px", height: "60px" },
    medium: { width: "120px", height: "120px" },
    large: { width: "180px", height: "180px" },
    xlarge: { width: "240px", height: "240px" },
  };

  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fallbackIcon="paw"
      className="rounded"
      style={{
        ...sizeMap[size],
        objectFit: "cover",
      }}
      {...props}
    />
  );
};

// Componente para imagens de banner
export const BannerImage = ({ src, alt, height = "200px", ...props }) => {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      fallbackIcon="image"
      style={{
        width: "100%",
        height,
        objectFit: "cover",
      }}
      {...props}
    />
  );
};

export default OptimizedImage;
