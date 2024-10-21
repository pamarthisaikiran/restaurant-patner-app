 /* import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../../firebase'; // Import googleProvider
import {
  signInWithEmailAndPassword,
  signInWithPopup,
 
} from 'firebase/auth'; // Import required functions from Firebase
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie
import './index.css'; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
 
  
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Redirect to home if already logged in
        navigate('/', { replace: true });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  // Handle login with email and password
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user's email is verified
      if (!user.emailVerified) {
        setErrorMessage('Your email is not verified. Please check your email for verification link.');
        return;
      }

      // Get the JWT token
      const token = await user.getIdToken(); // Get JWT token from Firebase
      Cookies.set('token', token, { expires: 7 }); // Store JWT token in a cookie that expires in 7 days

      // Redirect to home after successful login
      navigate('/', { replace: true });
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setErrorMessage('You do not have an account. Please sign up.');
      } else {
        setErrorMessage('Error logging in: ' + error.message);
      }
      console.error('Error logging in:', error.message);
    }
  };

  // Handle login with Google
  const handleGoogleLogin = async () => {
    setErrorMessage(''); // Reset error message

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Log the user object to see if the email is populated
      console.log('Google User:', user);

      // Get the JWT token
      const token = await user.getIdToken();
      Cookies.set('token', token, { expires: 7 }); // Store JWT token in a cookie

      // Redirect to home after successful login
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage('Error logging in with Google: ' + error.message);
      console.error('Error logging in with Google:', error.message);
    }
  };

  // Setup reCAPTCHA


  // Handle phone number login
 

  // Handle OTP verification
  

  return (
    <div className="login-container">
      <div className="login-image">
        <img src="https://res.cloudinary.com/ddbhluguf/image/upload/v1729328631/Screenshot_2024-10-19_142458_oj67hu.png" alt="Login" />
      </div>
      <div className="login-form-container">
        <h2>Login</h2>

       
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

       
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <p>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>

       
        <button onClick={handleGoogleLogin}>Login with Google</button>

       
       

       
      
      </div>
    </div>
  );
};

export default Login;  */

import React, { useState, useEffect } from 'react';
import { auth, googleProvider } from '../../firebase'; // Import googleProvider
import {
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth'; // Import required functions from Firebase
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie
import './index.css'; // Import the CSS file

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error messages
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Redirect to home if already logged in
        navigate('/', { replace: true });
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [navigate]);

  // Handle login with email and password
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user's email is verified
      if (!user.emailVerified) {
        setErrorMessage('Your email is not verified. Please check your email for verification link.');
        return;
      }

      // Get the JWT token
      const token = await user.getIdToken(); // Get JWT token from Firebase
      Cookies.set('token', token, { expires: 7 }); // Store JWT token in a cookie that expires in 7 days

      // Redirect to home after successful login
      navigate('/', { replace: true });
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setErrorMessage('You do not have an account. Please sign up.');
      } else {
        setErrorMessage('Error logging in: ' + error.message);
      }
      console.error('Error logging in:', error.message);
    }
  };

  // Handle login with Google
  const handleGoogleLogin = async () => {
    setErrorMessage(''); // Reset error message

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Get the JWT token
      const token = await user.getIdToken();
      Cookies.set('token', token, { expires: 7 }); // Store JWT token in a cookie

      // Redirect to home after successful login
      navigate('/', { replace: true });
    } catch (error) {
      setErrorMessage('Error logging in with Google: ' + error.message);
      console.error('Error logging in with Google:', error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-image">
        <img src="https://res.cloudinary.com/ddbhluguf/image/upload/v1729328631/Screenshot_2024-10-19_142458_oj67hu.png" alt="Login" />
      </div>
      <div className="login-form-container">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>

        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <p>
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>

        <button onClick={handleGoogleLogin}>Login with Google</button>
      </div>
    </div>
  );
};

export default Login; 



