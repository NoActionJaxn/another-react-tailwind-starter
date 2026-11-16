import { Checkbox } from '@noactionjaxn/another-react-tailwind-component-library';
import { Controller, type UseFormReturn } from 'react-hook-form';

interface CheckboxFieldProps {
  name: string;
  label: string;
  required?: boolean;
  form: UseFormReturn;
}

const CheckboxField = ({ name, label, required, form }: CheckboxFieldProps) => (
  <Controller
    control={form.control}
    name={name}
    render={({ field, fieldState }) => (
      <Checkbox
        id={name}
        name={name}
        label={label}
        required={required}
        checked={!!field.value}
        onCheckedChange={(checked) => field.onChange(checked === true)}
        onBlur={field.onBlur}
        ref={field.ref}
        aria-invalid={fieldState.invalid || undefined}
      />
    )}
  />
);

export default CheckboxField;
