// File: frontend/src/components/common/Spinner.jsx

import React from 'react';
import './Spinner.scss';

const Spinner = ({ size = 'medium', text = '', inline = false }) => {
  const sizeClass = `spinner-${size}`;
  const displayClass = inline ? 'spinner-inline' : 'spinner-block';

  return (
    <div className={`spinner-container ${displayClass}`}>
      <i className={`fas fa-spinner fa-spin ${sizeClass}`}></i>
      {text && <span className="spinner-text">{text}</span>}
    </div>
  );
};

export default Spinner;
