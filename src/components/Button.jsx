import React, { useState } from 'react';

/**
 * Button Component
 * 
 * @param {string} text - The text content of the button
 * @param {string} bgColor - Background color (use CSS variables from custom.css or direct color values)
 * @param {string} hoverColor - Color to change to on hover
 * @param {string} textColor - Text color (default white)
 * @param {function} onClick - Function to execute on click
 * @param {string} className - Additional CSS classes
 */
const Button = ({
  text = "Button",
  bgColor = "var(--main-color)",
  hoverColor = "var(--bg-button)",
  textColor = "white",
  onClick,
  className = ""
}) => {
  const [isHover, setIsHover] = useState(false);
  
  const buttonStyle = {
    backgroundColor: isHover ? hoverColor : bgColor,
    color: textColor,
    padding: '0.5rem 1.2rem',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'background-color 0.3s ease',
    borderBottom: isHover ? `3px solid ${bgColor}` : `3px solid ${hoverColor}`
  };

  return (
    <button
      className={`custom-button ${className}`}
      style={buttonStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {text}
    </button>
  );
};

export default Button; 