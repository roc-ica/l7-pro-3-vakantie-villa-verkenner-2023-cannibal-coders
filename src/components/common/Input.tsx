import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const Input: React.FC<InputProps> = ({ label, error, ...props }) => {
  return (
    <div className="mb-4">
      {label && <label className="block mb-2 text-gray-700">{label}</label>}
      <input
        className={`w-full px-3 py-2 border rounded ${error ? 'border-red-500' : 'border-gray-300'}`}
        {...props}
      />
      {error && <p className="mt-1 text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default Input;
