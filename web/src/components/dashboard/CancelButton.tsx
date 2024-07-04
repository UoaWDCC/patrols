import React from 'react';

interface CancelButtonProps {
  onClick?: () => void;
}

const CancelButton: React.FC<CancelButtonProps> = ({ onClick }) => {
  return (
    <button
        type="button"
        className="mr-3 px-4 py-2 text-sm text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600"
        onClick={onClick}
    >
    Cancel
    </button>
  );
};

export default CancelButton;
