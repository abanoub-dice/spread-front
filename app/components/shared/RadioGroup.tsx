import React from 'react';
import { Radio, RadioGroup as MuiRadioGroup, FormControlLabel, FormControl, FormLabel } from '@mui/material';

export interface RadioOption {
  label: string;
  value: string;
}

interface RadioGroupProps {
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, value, onChange, label }) => {
  return (
    <FormControl component="fieldset" sx={{ width: '100%' }}>
      {label && <FormLabel component="legend">{label}</FormLabel>}
      <MuiRadioGroup
        row
        value={value}
        onChange={e => onChange(e.target.value)}
        sx={{ gap: 2, background: '#fff7f5', p: 2, borderRadius: 2 }}
      >
        {options.map(option => (
          <FormControlLabel
            key={option.value}
            value={option.value}
            control={<Radio sx={{ color: '#fe520a', '&.Mui-checked': { color: '#fe520a' } }} />}
            label={option.label}
          />
        ))}
      </MuiRadioGroup>
    </FormControl>
  );
};

export default RadioGroup; 