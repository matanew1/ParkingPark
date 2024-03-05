import React, { useState } from "react";
import { auth, firebase } from "./firebase";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  async function sendTokenToBackend(token) {
    try {
      const response = await axios.get('http://localhost:4000/login', {
        headers: {
          'Authorization': token
        }
      });
  
      // Handle response if needed
      const data = response.data;
      
      if (response.status === 200) {
        // Redirect to a new page upon successful response
        navigate('/profile', { state: data });

      }
      
    } catch (error) {
      console.error('Error sending token to backend:', error);
      // Handle error
    }
  }

  async function googleLogin() {
    const provider = new firebase.auth.GoogleAuthProvider();
    try {
      const result = await auth.signInWithPopup(provider);
      const user = result.user;
      const token = await user.getIdToken(true);
      
      if (token) {
        localStorage.setItem("@token", token);
        sendTokenToBackend(token); 
      }
    } catch (error) {
      setError(error.message);
    }
  }

  async function anonymousSignIn() {
    try {
      await auth.signInAnonymously();
      const currentUser = auth.currentUser;
      const token = await currentUser.getIdToken(true);
      
      if (token) {
        localStorage.setItem("@token", token);
      }
      navigate('/profile')
    } catch (error) {
      setError(error.message);
    }
  }

  return (
    <div>
      {error && <p>{error}</p>}
      <button onClick={googleLogin} className="register-button">
        Login / Register with Google
      </button>
      <button onClick={anonymousSignIn} className="register-button">
        Login Anonymously
      </button>
    </div>
  );
}
