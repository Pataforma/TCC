import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { navigateWithLoading } from '../utils/navigation';

/**
 * Botão que redireciona o usuário com uma tela de carregamento intermediária
 */
function LoadingButton({
  to,
  text,
  loadingMessage = "Carregando...",
  timeout = 2000,
  ...buttonProps
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigateWithLoading(navigate, to, {
      message: loadingMessage,
      timeout: timeout
    });
  };

  return (
    <Button
      text={text}
      onClick={handleClick}
      {...buttonProps}
    />
  );
}

export default LoadingButton; 