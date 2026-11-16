import { Switch } from '@noactionjaxn/another-react-tailwind-component-library';
import { Controller, type UseFormReturn } from 'react-hook-form';

interface SwitchFieldProps {
  name: string;
  label: string;
  required?: boolean;
  form: UseFormReturn;
}

const SwitchField = ({ name, label, required, form }: SwitchFieldProps) => (
  <Controller
    control={form.control}
    name={name}
    render={({ field, fieldState }) => (
      <Switch
        id={name}
        name={name}
        label={label}
        required={required}
        checked={!!field.value}
        onCheckedChange={field.onChange}
        onBlur={field.onBlur}
        ref={field.ref}
        aria-invalid={fieldState.invalid || undefined}
      />
    )}
  />
);

export default SwitchField;
