import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import '../App.css';

function Signup() {
  const navigate = useNavigate();
  const [passwordType, setPasswordType] = useState('password');
  const [error, setError] = useState('');
  const [data, setData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    password: ''
  });

  const togglePassword = () => {
    setPasswordType(passwordType === 'password' ? 'text' : 'password');
  };

  const onSignupFormSubmition = async (e) => {
    e.preventDefault();

    const { firstName, lastName, username, password } = data;

    try {
      const response = await axios.post('http://localhost:8000/user/signup', {
        firstName, lastName, username, password
      });

      if (response.data.message) {
        toast.success(response.data.message);
        setData({ firstName: '', lastName: '', username: '', password: '' }); 
        navigate('/signin');
      } else if (response.data.error) {
        setError(response.data.error); 
        toast.error(response.data.error); 
      }
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'An unexpected error occurred.';
      setError(errorMessage); 
      toast.error(errorMessage); 
      console.log('Signup error:', errorMessage); 
    }
  };

  return (
    <div className="sign-up-form-container">
      <form onSubmit={onSignupFormSubmition} className="form-element">
        <h1 className="sign-up-heading">Signup</h1>
        <label htmlFor="firstname">Firstname</label>
        <input
          type="text"
          id="firstname"
          className="input-field"
          placeholder="John"
          value={data.firstName}
          onChange={(e) => setData({ ...data, firstName: e.target.value })}
        />
        <label htmlFor="lastname">Lastname</label>
        <input
          type="text"
          id="lastname"
          className="input-field"
          placeholder="Doe"
          value={data.lastName}
          onChange={(e) => setData({ ...data, lastName: e.target.value })}
        />
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          className="input-field"
          placeholder="example@gmail.com"
          value={data.username}
          onChange={(e) => setData({ ...data, username: e.target.value })}
        />
        <label htmlFor="password">Password</label>
        <div className="password-container">
          <input
            type={passwordType}
            id="password"
            className="input-field"
            placeholder="Password"
            value={data.password}
            onChange={(e) => setData({ ...data, password: e.target.value })}
          />
          <button type="button" className="toggle-password" onClick={togglePassword}>
            {passwordType === 'password' ? '👁️' : '🙈'}
          </button>
        </div>
        <button type="submit" className="submit-button">Sign Up</button>
        {error && <p className="error-message">{error}</p>} 
        <p className="login-message">
          Already have an account? <Link to="/signin" className="login-link">Login here</Link>.
        </p>
      </form>
    </div>
  );
}

export default Signup;
