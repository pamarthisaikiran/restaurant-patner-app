// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { auth } from '../../firebase'; // Import your Firebase auth instance

const ProtectedRoute = ({ element }) => {
  const user = auth.currentUser; // Get the current user
  const token = Cookies.get('token'); // Get the JWT token from cookies

  // Check if user is authenticated or if the token exists
  const isAuthenticated = user && token;

  return isAuthenticated ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
