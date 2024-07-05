import React from 'react';

interface CheckboxInputFieldProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CheckboxInputField: React.FC<CheckboxInputFieldProps> = ({ id, label, checked, onChange }) => {
  return (
    <div className="mb-4">
        <div className="flex items-center">
            <input
                type="checkbox"
                id={id}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                checked={checked}
                onChange={onChange}
            />
            <label htmlFor={id} className="ml-2 block text-sm text-gray-900">{label}</label>
        </div>
    </div>
  );
};

export default CheckboxInputField;
