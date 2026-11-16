import {
  Label,
  NumberInput,
  TextInput,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  tw,
} from '@noactionjaxn/another-react-tailwind-component-library';
import { Info } from 'lucide-react';
import type { UseFormReturn } from 'react-hook-form';
import CheckboxField from './fields/CheckboxField';
import CheckboxGroupField from './fields/CheckboxGroupField';
import FileUploadField from './fields/FileUploadField';
import PhoneField from './fields/PhoneField';
import RadioGroupField from './fields/RadioGroupField';
import SelectField from './fields/SelectField';
import SwitchField from './fields/SwitchField';
import type { FormField as FormFieldType } from '@/types/directus-schema';

interface FieldProps {
  field: FormFieldType;
  form: UseFormReturn;
}

const widthClasses: Record<string, string> = {
  100: 'basis-full',
  67: 'basis-full md:basis-[calc(67%-1rem)]',
  50: 'basis-full md:basis-[calc(50%-1rem)]',
  33: 'basis-full md:basis-[calc(33%-1rem)]',
};

/** Native textarea styled like the library TextInput (the library has no textarea). */
const textareaClasses =
  'block min-h-28 w-full rounded-md border border-default-300 bg-transparent px-3 py-2 text-base text-default-900 transition-colors placeholder:text-default-400 hover:border-default-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-900 aria-invalid:border-red-500';

/** Types whose control renders its own inline label (checkbox and switch). */
const inlineLabelTypes = new Set(['checkbox', 'switch']);

const Field = ({ field, form }: FieldProps) => {
  if (field.type === 'hidden' || !field.name) return null;

  const name = field.name;
  const required = !!field.required;
  const error = form.formState.errors[name]?.message as string | undefined;
  const errorId = `${name}-error`;
  const helpId = `${name}-help`;
  const describedBy = [error && errorId, field.help && helpId].filter(Boolean).join(' ') || undefined;

  const inputProps = {
    id: name,
    block: true,
    required,
    placeholder: field.placeholder || undefined,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': describedBy,
    ...form.register(name),
  };

  const control = (() => {
    switch (field.type) {
      case 'text':
        return <TextInput type="text" {...inputProps} />;
      case 'email':
        return <TextInput type="email" autoComplete="email" {...inputProps} />;
      case 'url':
        return <TextInput type="url" {...inputProps} />;
      case 'number':
        return <NumberInput inputMode="decimal" {...inputProps} />;
      case 'tel':
        return <PhoneField name={name} placeholder={field.placeholder} required={required} form={form} />;
      case 'textarea':
        return (
          <textarea
            className={textareaClasses}
            id={name}
            required={required}
            placeholder={field.placeholder || undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy}
            {...form.register(name)}
          />
        );
      case 'checkbox':
        return <CheckboxField name={name} label={field.label ?? name} required={required} form={form} />;
      case 'switch':
        return <SwitchField name={name} label={field.label ?? name} required={required} form={form} />;
      case 'checkbox_group':
        return <CheckboxGroupField name={name} options={field.choices || []} form={form} />;
      case 'radio':
        return <RadioGroupField name={name} options={field.choices || []} required={required} form={form} />;
      case 'select':
        return (
          <SelectField
            name={name}
            placeholder={field.placeholder}
            options={field.choices || []}
            required={required}
            form={form}
          />
        );
      case 'file':
        return <FileUploadField name={name} required={required} form={form} />;
      default:
        return null;
    }
  })();

  if (!control) return null;

  const showLabel = !inlineLabelTypes.has(field.type ?? '');

  return (
    <div className={tw('flex shrink-0 flex-col gap-2', widthClasses[field.width ?? '100'] ?? widthClasses[100])}>
      {(showLabel || field.help) && (
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {showLabel && (
              <Label id={`${name}-label`} htmlFor={name}>
                {field.label}
                {required && (
                  <span aria-hidden className="ms-0.5 text-red-600">
                    *
                  </span>
                )}
              </Label>
            )}
            {field.help && (
              <Tooltip>
                <TooltipTrigger
                  type="button"
                  aria-label={`Help: ${field.label ?? name}`}
                  className="opacity-60 hover:opacity-100"
                >
                  <Info className="size-4" aria-hidden />
                </TooltipTrigger>
                <TooltipContent id={helpId}>{field.help}</TooltipContent>
              </Tooltip>
            )}
          </div>
        </div>
      )}
      {control}
      {error && (
        <p id={errorId} role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default Field;
