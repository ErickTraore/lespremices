import React, { useState } from 'react';
import './ContactForm.css';
import Organigrammes from '../organigrammes/Organigrammes'; // Importez le composant Organigrammes


const ContactForm = () => {
  const [activeSubPage, setActiveSubPage] = useState('adhesion ');

  const navigateToSubPage = (subPage) => {
    setActiveSubPage(subPage);
  };

  return (
    <div className="contact-form">
      <h1>ContactForm</h1>
      <ul className="sub-menu">
        <li onClick={() => navigateToSubPage('organigrammes')}>Organigrammes</li>
      </ul>
      <div className="sub-page-content">
        {activeSubPage === 'organigrammes' && <Organigrammes />}
      </div>
    </div>
  );
};

export default ContactForm;

