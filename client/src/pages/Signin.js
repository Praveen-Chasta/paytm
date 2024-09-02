import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useRecoilState } from 'recoil';
import { userFriendsState } from '../state/atom/atom';
import { jwtDecode } from 'jwt-decode';
import '../App.css';

function Signin() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    username: '',
    password: ''
  });
  const [passwordType, setPasswordType] = useState('password');
  const [user, setUser] = useRecoilState(userFriendsState);

  const togglePassword = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  const onFormSubmission = async (e) => {
    e.preventDefault();
    
    const { username, password } = data;

    try {
      const response = await axios.post('http://localhost:8000/user/signin', {
        username, password
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Store token in localStorage
        
        // Decode the token to get user ID
        const decodedToken = jwtDecode(response.data.token);
        const userId = decodedToken.userId;

        // Set user data including balance from response in Recoil state
        setUser({
          userId,
          username,
          balance: Math.floor(response.data.balance) // Ensure balance is an integer
        });

        toast.success("Login Successfully");
        navigate('/dashboard');
      } else {
        toast.error(response.data.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred.';
      toast.error(typeof errorMessage === 'string' ? errorMessage : 'An unexpected error occurred.');
      console.log(error);
    }
  };

  return (
    <div className="login-form-container">
      <form onSubmit={onFormSubmission} className="login-form-element">
        <h1 className="login-heading">Login</h1>
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          className="login-input-field"
          placeholder="Email"
          onChange={(e) => setData({ ...data, username: e.target.value })}
        />
        <label htmlFor="password">Password</label>
        <div className="login-password-container">
          <input
            type={passwordType}
            id="password"
            className="login-input-field"
            placeholder="Password"
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <button
            type="button"
            className="login-toggle-password"
            onClick={togglePassword}
          >
            {passwordType === 'password' ? '👁️' : '🙈'}
          </button>
        </div>
        <button type="submit" className="login-submit-button">Sign In</button>
      </form>
    </div>
  );
}

export default Signin;
