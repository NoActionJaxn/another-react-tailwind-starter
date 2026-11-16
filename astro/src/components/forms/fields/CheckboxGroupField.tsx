import { Checkbox } from '@noactionjaxn/another-react-tailwind-component-library';
import { Controller, type UseFormReturn } from 'react-hook-form';

interface CheckboxGroupFieldProps {
  name: string;
  options: { value: string; text: string }[];
  form: UseFormReturn;
}

const CheckboxGroupField = ({ name, options, form }: CheckboxGroupFieldProps) => (
  <Controller
    control={form.control}
    name={name}
    render={({ field, fieldState }) => {
      const values: string[] = Array.isArray(field.value) ? field.value : [];

      return (
        <div role="group" aria-labelledby={`${name}-label`} className="flex flex-col gap-2">
          {options.map((option) => (
            <Checkbox
              key={option.value}
              id={`${name}-${option.value}`}
              label={option.text}
              checked={values.includes(option.value)}
              onCheckedChange={(checked) =>
                field.onChange(
                  checked === true ? [...values, option.value] : values.filter((value) => value !== option.value),
                )
              }
              onBlur={field.onBlur}
              aria-invalid={fieldState.invalid || undefined}
            />
          ))}
        </div>
      );
    }}
  />
);

export default CheckboxGroupField;
