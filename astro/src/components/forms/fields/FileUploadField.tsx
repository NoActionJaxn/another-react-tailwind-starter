import { Controller, type UseFormReturn } from 'react-hook-form';

interface FileUploadFieldProps {
  name: string;
  required?: boolean;
  form: UseFormReturn;
}

/** The library has no file input, so this is a native one styled to match its TextInput. */
const FileUploadField = ({ name, required, form }: FileUploadFieldProps) => (
  <Controller
    control={form.control}
    name={name}
    render={({ field, fieldState }) => (
      <input
        type="file"
        id={name}
        name={name}
        required={required}
        ref={field.ref}
        onBlur={field.onBlur}
        onChange={(e) => field.onChange(e.target.files?.[0])}
        aria-invalid={fieldState.invalid || undefined}
        className="block w-full cursor-pointer rounded-md border border-default-300 bg-transparent text-base text-default-900 transition-colors hover:border-default-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-default-900 file:mr-3 file:cursor-pointer file:border-0 file:border-r file:border-default-300 file:bg-default-100 file:px-3 file:py-2 file:text-default-900 aria-invalid:border-red-500"
      />
    )}
  />
);

export default FileUploadField;
