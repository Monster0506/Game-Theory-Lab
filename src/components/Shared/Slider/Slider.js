import React, { useState } from 'react';
import './Slider.css';

const Slider = ({ 
  min, 
  max, 
  step = 1, 
  value: initialValue = min,
  onChange,
  onSubmit,
  title,
  leftLabel,
  rightLabel,
  submitLabel = 'Submit'
}) => {
  const [value, setValue] = useState(initialValue);

  const handleChange = (e) => {
    const newValue = parseInt(e.target.value);
    setValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(value);
    }
  };

  return (
    <div className="slider-container">
      {title && <div className="slider-title">{title}</div>}
      <div className="slider-value">{value}</div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={handleChange}
        className="slider-input"
      />
      <div className="slider-labels">
        <span>{leftLabel || min}</span>
        <span>{rightLabel || max}</span>
      </div>
      <button 
        className="submit-button"
        onClick={handleSubmit}
      >
        {submitLabel}
      </button>
    </div>
  );
};

export default Slider;
