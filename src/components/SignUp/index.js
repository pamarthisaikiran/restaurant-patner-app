import React, { useState } from 'react';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State for success message
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const navigate = useNavigate(); // useNavigate for redirection

  const handleSignup = async (e) => {
    e.preventDefault();
    console.log('Form Submitted');
    setSuccessMessage('');
    setErrorMessage('');
    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send email verification
      await sendEmailVerification(user);
      console.log('Verification email sent to:', user.email);

      // Show success message
      setSuccessMessage(
        'You have successfully signed up. Please check your email to verify your account before you can log in.'
      );
      
      // Disable further actions until they verify
      // You can use this as a blocking message and prevent login attempts until verified.
      setTimeout(() => {
        navigate('/login'); // Redirect to login page after 5 seconds
      }, 5000); // Redirect after 5 seconds
      
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setErrorMessage('This email is already registered');
      } else if (error.code === 'auth/invalid-email') {
        setErrorMessage('Invalid email format');
      } else {
        setErrorMessage(`Error signing up: ${error.message}`);
      }
      console.error('Error signing up:', error.message);
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      <form className="signup-form-container" onSubmit={handleSignup}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Sign Up</button>
      </form>

      {/* Display Success Message */}
      {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

      {/* Display Error Message */}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

      <p>
        Already have an account? <a href="/login">Login</a>
      </p>
    </div>
  );
};

export default Signup;
