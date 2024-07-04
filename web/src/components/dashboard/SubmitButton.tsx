import React from 'react';

interface SubmitButtonProps {
  onClick?: () => void;
  label: string;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({ label }) => {
  return (
    <button
        type="submit"
        className="px-4 py-2 text-sm text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:bg-green-600"
    >
    {label}
    </button>
  );
};

export default SubmitButton;
