// src/components/RadioButtonGroup.tsx
import { Radio, FormControlLabel, RadioGroup } from '@mui/material';

interface RadioButtonGroupProps {
  options: { value: string; label: string }[];
  name: string;
  selectedValue?: string | number;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  sx?: object;
  disabled?: boolean;
}

// Refactor to a function declaration
function RadioButtonGroup({
  options,
  name,
  selectedValue,
  onChange,
  sx = {},
  disabled = false,
}: RadioButtonGroupProps): React.JSX.Element {
  return (
    <RadioGroup name={name} value={selectedValue} onChange={onChange} sx={sx}>
      {options.map((option) => (
        <FormControlLabel
          key={option.value}
          value={option.value}
          control={
            <Radio
              disabled={disabled}
              sx={{
                '& .MuiSvgIcon-root': {
                  backgroundColor: '#DDDDDD', // Background color for unchecked state
                  borderRadius: '50%', // Make it circular
                },
                '&.Mui-checked .MuiSvgIcon-root': {
                  backgroundColor: '#DDDDDD', // Background color for checked state
                  color: '#FF5732', // Checked color
                },
                '&.MuiRadio-root': {
                  color: '#DDDDDD', // Ensures that icon color blends with background
                },
              }}
            />
          }
          label={option.label}
          sx={{
            '.MuiFormControlLabel-label': {
              fontWeight: 400,
              fontSize: '1.3rem',
              color: '#444',
            },
          }}
        />
      ))}
    </RadioGroup>
  );
}

export default RadioButtonGroup;
