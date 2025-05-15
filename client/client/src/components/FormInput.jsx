import React from 'react';

const FormInput = ({
  label,
  type,
  id,
  placeholder,
  value,
  onChange,
  required = false,
  error,
}) => {
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="error-text">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-input ${error ? 'error' : ''}`}
        required={required}
      />
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default FormInput;