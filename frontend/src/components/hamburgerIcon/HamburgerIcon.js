import React from 'react';

const HamburgerIcon = ({ isOpen, toggleMenu }) => {
  return (
    <button className="App__header__actions__hamburger__icon" onClick={toggleMenu}>
      {isOpen ? '✖' : '☰'}
    </button>
  );
};

export default HamburgerIcon;
