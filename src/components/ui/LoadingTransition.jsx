import React, { useEffect, useState } from "react";
import Loader from "./Loader";

function LoadingTransition({
  onComplete,
  timeout = 2000,
  message = "Carregando...",
  color = "secondary",
  size = "large",
  ariaLabel = "Carregando página",
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const endTime = startTime + timeout;

    const updateProgress = () => {
      const currentTime = Date.now();
      const elapsedTime = currentTime - startTime;
      const newProgress = Math.min(
        100,
        Math.floor((elapsedTime / timeout) * 100)
      );

      setProgress(newProgress);

      if (currentTime < endTime) {
        requestAnimationFrame(updateProgress);
      } else {
        // Tempo de transição concluído
        if (onComplete && typeof onComplete === "function") {
          onComplete();
        }
      }
    };

    const animationFrame = requestAnimationFrame(updateProgress);

    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, [timeout, onComplete]);

  return (
    <div className="loading-transition" role="status" aria-label={ariaLabel}>
      <div className="loading-content">
        <Loader size={size} color={color} ariaLabel={ariaLabel} />
        <h2 className="loading-message">{message}</h2>
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${progress}%` }}
            aria-valuenow={progress}
            aria-valuemin="0"
            aria-valuemax="100"
            role="progressbar"
            aria-label={`Progresso: ${progress}%`}
          ></div>
        </div>
        <div className="progress-text" aria-live="polite">
          {progress}%
        </div>
      </div>
    </div>
  );
}

export default LoadingTransition;
