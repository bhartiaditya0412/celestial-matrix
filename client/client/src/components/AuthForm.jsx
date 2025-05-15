import React, { useState } from 'react';
import LoginForm from './LoginForm';
import SignupForm from './SignUpForm';
import { useNavigate } from 'react-router-dom';
import makeRequest from '../services/makeRequest';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formKey, setFormKey] = useState(0);
  const navigate = useNavigate();
  const handleToggleForm = () => {
    setTimeout(() => {
      setIsLogin(!isLogin);
      setFormKey(prev => prev + 1);
    }, 100);
  };

    const handleLoginSubmit = async (email, password) => {
    try {
      await makeRequest("/login", {
        method: "POST",
        data: { email, password },
      });
      navigate("/posts");
    } catch (err) {
      alert(`Login failed: ${err}`);
    }
  };

  const handleSignupSubmit = async (name, email, password) => {
    try {
      await makeRequest("/signup", {
        method: "POST",
        data: { name, email, password },
      });
      navigate("/posts");
    } catch (err) {
      alert(`Signup failed: ${err}`);
    }
  };

  return (
    <div className="form-container">
      <div className="card" key={formKey}>
        <div className="card-body">
          {isLogin ? (
            <LoginForm
              onSubmit={handleLoginSubmit}
              onSwitchForm={handleToggleForm}
            />
          ) : (
            <SignupForm
              onSubmit={handleSignupSubmit}
              onSwitchForm={handleToggleForm}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;