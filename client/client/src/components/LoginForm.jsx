import React, { useState } from 'react';
import FormInput from './FormInput';
import { Mail, Lock } from 'lucide-react';
import './Login.css'
const LoginForm = ({ onSubmit, onSwitchForm }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!email) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(email, password);
    }
  };

  return (
    <div>
      <div className="text-center">
        <h2>Welcome back</h2>
        <p>Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <Mail />
          <FormInput
            label="Email"
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            error={errors.email}
          />
        </div>

        <div className="input-group">
          <Lock />
          <FormInput
            label="Password"
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={errors.password}
          />
        </div>

        <div className="checkbox-group">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="checkbox-input"
          />
          <label htmlFor="remember-me" className="checkbox-label">
            Remember me
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          Sign in
        </button>

        <div className="text-center mt-4">
          <p>
            Don't have an account?{' '}
            <button type="button" onClick={onSwitchForm} className="switch-form">
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;