import React from 'react';

function Loader({ size = 'medium', color = 'primary' }) {
  // Classes dinâmicas com base nos props
  const sizeClass = {
    small: 'loader-sm',
    medium: 'loader-md',
    large: 'loader-lg'
  }[size] || 'loader-md';

  const colorClass = {
    primary: 'loader-primary',
    secondary: 'loader-secondary',
    elements: 'loader-elements'
  }[color] || 'loader-primary';

  return (
    <div className={`loader-container ${sizeClass}`}>
      <div className={`loader-paw ${colorClass}`}>
        <div className="paw-print paw-main"></div>
        <div className="paw-print paw-pad1"></div>
        <div className="paw-print paw-pad2"></div>
        <div className="paw-print paw-pad3"></div>
        <div className="paw-print paw-pad4"></div>
      </div>
    </div>
  );
}

export default Loader; 