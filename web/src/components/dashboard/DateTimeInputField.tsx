import React from 'react';

interface DateTimeInputFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DateTimeInputField: React.FC<DateTimeInputFieldProps> = ({ label, name, value, onChange }) => {
  return (
    <div className="mb-4">
        <label className="block text-sm font-bold mb-2">{label}</label>
        <input
            type="datetime-local"
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
        />
    </div>
  );
};

export default DateTimeInputField;
