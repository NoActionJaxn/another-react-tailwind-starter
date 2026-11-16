import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@noactionjaxn/another-react-tailwind-component-library';
import { Controller, type UseFormReturn } from 'react-hook-form';

interface SelectFieldProps {
  name: string;
  options: { value: string; text: string }[];
  placeholder?: string | null;
  required?: boolean;
  form: UseFormReturn;
}

const SelectField = ({ name, options, placeholder, required, form }: SelectFieldProps) => (
  <Controller
    control={form.control}
    name={name}
    render={({ field, fieldState }) => (
      <Select name={name} required={required} value={field.value || undefined} onValueChange={field.onChange}>
        <SelectTrigger
          id={name}
          ref={field.ref}
          onBlur={field.onBlur}
          className="w-full"
          aria-invalid={fieldState.invalid || undefined}
        >
          <SelectValue placeholder={placeholder || 'Select an option'} />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.text}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    )}
  />
);

export default SelectField;
