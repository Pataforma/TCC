import React, { useState } from 'react';

/**
 * Botao Component
 * 
 * @param {string} text - O texto do botão
 * @param {string} bgColor - Cor de fundo (use variáveis CSS de custom.css ou valores diretos)
 * @param {string} hoverColor - Cor ao passar o mouse
 * @param {string} textColor - Cor do texto (padrão: branco)
 * @param {function} onClick - Função a ser executada no clique
 * @param {string} className - Classes CSS adicionais
 */
const Botao = ({
  text = "Botao",
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

export default Botao; 