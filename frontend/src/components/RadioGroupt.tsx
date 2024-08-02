import React, { useState } from 'react';

// Defina um tipo para as opções de rádio
type RadioOption = {
  value: string;
  label: string;
};

// Defina as props do componente
interface RadioGroupProps {
  options: RadioOption[];
  name: string;
  onChange: (value: string) => void;
  selectedValue: string;
}

export default function RadioGroup (props: RadioGroupProps) {
  return (
    <div>
      {props.options.map((option: RadioOption) => (
        <label key={option.value}>
          <input
            type="radio"
            name={props.name}
            value={option.value}
            checked={props.selectedValue === option.value}
            onChange={() => props.onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};
