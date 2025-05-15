import React, { useState } from 'react';
import FormInput from './FormInput';
import { User, Mail, Lock } from 'lucide-react';
import './form.css'

const SignupForm = ({ onSubmit, onSwitchForm }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (!name) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

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

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
      isValid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(name, email, password);
    }
  };

  return (
    <div>
      <div className="text-center">
        <h2>Create an account</h2>
        <p>Join us and get started today</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <User />
          <FormInput
            label="Full Name"
            type="text"
            id="name"
            placeholder="Enter your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            error={errors.name}
          />
        </div>

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
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            error={errors.password}
          />
        </div>

        <div className="input-group">
          <Lock />
          <FormInput
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            error={errors.confirmPassword}
          />
        </div>

        <div className="checkbox-group">
          <input
            id="terms"
            name="terms"
            type="checkbox"
            className="checkbox-input"
            required
          />
          <label htmlFor="terms" className="checkbox-label">
            I agree to the{' '}
            <a href="#" className="link">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="#" className="link">
              Privacy Policy
            </a>
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          Sign up
        </button>

        <div className="text-center mt-4">
          <p>
            Already have an account?{' '}
            <button type="button" onClick={onSwitchForm} className="switch-form">
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;