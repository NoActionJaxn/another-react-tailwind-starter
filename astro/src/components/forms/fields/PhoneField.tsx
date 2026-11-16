import { PhoneInput } from '@noactionjaxn/another-react-tailwind-component-library/phone-input';
import { Controller, type UseFormReturn } from 'react-hook-form';

interface PhoneFieldProps {
  name: string;
  placeholder?: string | null;
  required?: boolean;
  form: UseFormReturn;
}

/** Stores the number in E.164 format (e.g. "+15555555555"), which the server validates. */
const PhoneField = ({ name, placeholder, required, form }: PhoneFieldProps) => (
  <Controller
    control={form.control}
    name={name}
    render={({ field, fieldState }) => (
      <PhoneInput
        id={name}
        name={name}
        block
        required={required}
        placeholder={placeholder || undefined}
        value={field.value ?? ''}
        onValueChange={field.onChange}
        onBlur={field.onBlur}
        aria-invalid={fieldState.invalid || undefined}
      />
    )}
  />
);

export default PhoneField;
