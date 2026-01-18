// File: lespremices/frontend/src/components/pageContent/Home.jsx

import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import './Home.css';
import NewPresse from '../presse/PresseList.jsx';
import AdminPresseManager from './AdminPresseManager.jsx';

const Home = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setIsAdmin(decoded?.isAdmin === true);
      } catch (error) {
        console.error("Erreur décodage token:", error);
        setIsAdmin(false);
      }
    }
  }, []);

  return (
    <div> 
      {isAdmin ? (
        <AdminPresseManager />
      ) : (
        <NewPresse />
      )}
    </div>
  );
};

export default Home;
