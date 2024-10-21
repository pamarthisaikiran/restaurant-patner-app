// App.js or wherever you define your routes
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUp';

import Home from './components/Home'; // Your home component
import MenuItems from './components/MenuItems';
import Orders from './components/Orders';

import ProtectedRoute from './components/ProtectedRoute'; // Import your protected route

const App = () => {
  return (
    <Router>
      
      <Routes>
     
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Use the ProtectedRoute wrapper for protected routes */}
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />
        <Route path="/menu" element={<ProtectedRoute element={<MenuItems />} />} />
        <Route path="/orders" element={<ProtectedRoute element={<Orders />} />} />
      </Routes> 
    </Router>
  );
};

export default App;
