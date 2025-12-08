import React from "react";
import styles from "./LoadingSpinner.module.css";

const LoadingSpinner = ({
  size = "medium",
  variant = "primary",
  fullscreen = false,
  text = "Carregando...",
}) => {
  const sizeClasses = {
    small: styles.spinnerSm,
    medium: styles.spinnerMd,
    large: styles.spinnerLg,
  };

  const variantClasses = {
    primary: styles.spinnerPrimary,
    secondary: styles.spinnerSecondary,
    light: styles.spinnerLight,
  };

  if (fullscreen) {
    return (
      <div className={styles.fullscreenWrapper}>
        <div className={styles.spinnerContainer}>
          <div
            className={`${styles.spinner} ${sizeClasses[size]} ${variantClasses[variant]}`}
          />
          {text && <p className={styles.loadingText}>{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.spinnerContainer}>
      <div
        className={`${styles.spinner} ${sizeClasses[size]} ${variantClasses[variant]}`}
      />
      {text && <p className={styles.loadingText}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
