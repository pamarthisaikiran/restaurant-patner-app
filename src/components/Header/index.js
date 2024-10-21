import React from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; // Make sure to import your Firebase auth instance
import Cookies from "js-cookie";

import "./index.css"

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.signOut().then(() => {
      Cookies.remove('token'); // Remove token from cookies on logout
      navigate('/login'); // Redirect to login after logout
    });
  };

  return (
    <nav>
      <ul className="navbar">
        <li onClick={() => navigate('/')}>Home</li>
        <li onClick={() => navigate('/menu')}>Menu Items</li>
        <li onClick={() => navigate('/orders')}>Orders</li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </nav>
  );
};

export default Header;
