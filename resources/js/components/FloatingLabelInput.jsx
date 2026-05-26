import React, { useState } from 'react';

const FloatingLabelInput = ({ label, type = 'text', value, onChange, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className="relative ">
      <input
        type={type}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        className={`block w-full px-4 py-3 text-base border rounded-md outline-none focus:border-blue-500 focus:ring-0 transition-all duration-200 text-slate-800 dark:text-slate-100
          ${isFocused || value ? 'pt-6 pb-1' : ''}
          `}
        {...props}
      />
      <label
        className={`absolute left-3 transition-all duration-200 text-slate-800 dark:text-slate-100 pointer-events-none
          ${isFocused || value ? '-top-3 text-sm bg-slate-100 dark:bg-slate-800 px-1' : 'top-3'}
        `}
      >
        {label}
      </label>
    </div>
  );
};

export default FloatingLabelInput;
