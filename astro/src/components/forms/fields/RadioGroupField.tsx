import { Radio, RadioGroup } from '@noactionjaxn/another-react-tailwind-component-library';
import { Controller, type UseFormReturn } from 'react-hook-form';

interface RadioGroupFieldProps {
  name: string;
  options: { value: string; text: string }[];
  required?: boolean;
  form: UseFormReturn;
}

const RadioGroupField = ({ name, options, required, form }: RadioGroupFieldProps) => (
  <Controller
    control={form.control}
    name={name}
    render={({ field, fieldState }) => (
      <RadioGroup
        name={name}
        required={required}
        value={field.value ?? ''}
        onValueChange={field.onChange}
        onBlur={field.onBlur}
        aria-labelledby={`${name}-label`}
        aria-invalid={fieldState.invalid || undefined}
        className="flex flex-col gap-2"
      >
        {options.map((option) => (
          <Radio key={option.value} id={`${name}-${option.value}`} value={option.value} label={option.text} />
        ))}
      </RadioGroup>
    )}
  />
);

export default RadioGroupField;
