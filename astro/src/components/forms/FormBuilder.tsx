import { useState } from 'react';
import { Alert, Card, tw } from '@noactionjaxn/another-react-tailwind-component-library';
import DynamicForm from './DynamicForm';
import type { FormField } from '@/types/directus-schema';

interface FormBuilderProps {
  className?: string;
  /** block_form id — passed to DynamicForm for draft visual editing paths */
  blockFormId?: string;
  form: {
    id: string;
    on_success?: 'redirect' | 'message' | null;
    sort?: number | null;
    submit_label?: string;
    success_message?: string | null;
    title?: string | null;
    success_redirect_url?: string | null;
    is_active?: boolean | null;
    fields: FormField[];
  };
}

const FormBuilder = ({ form, className, blockFormId }: FormBuilderProps) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!form.is_active) return null;

  const handleSubmit = async (data: Record<string, unknown>) => {
    setError(null);

    try {
      const formData = new FormData();
      formData.append('_formId', form.id);

      for (const field of form.fields) {
        if (!field.name) continue;
        const value = data[field.name];
        if (value === undefined || value === null) continue;

        if (value instanceof File) {
          formData.append(field.name, value);
        } else if (Array.isArray(value)) {
          formData.append(field.name, JSON.stringify(value));
        } else {
          formData.append(field.name, String(value));
        }
      }

      const response = await fetch('/api/forms/submit', { method: 'POST', body: formData });
      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(typeof body.error === 'string' ? body.error : 'Form submission failed');
      }

      if (form.on_success === 'redirect' && form.success_redirect_url) {
        window.location.href = form.success_redirect_url;
      } else {
        setIsSubmitted(true);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err instanceof Error ? err.message : 'Failed to submit the form. Please try again later.');
    }
  };

  if (isSubmitted) {
    return (
      <Alert status="success" role="status" className={className}>
        {form.success_message || 'Your form has been submitted successfully.'}
      </Alert>
    );
  }

  return (
    <Card className={tw('space-y-6 p-8', className)}>
      {form.title && <h3 className="text-xl font-semibold">{form.title}</h3>}

      {error && (
        <Alert status="danger" role="alert">
          {error}
        </Alert>
      )}

      <DynamicForm
        fields={form.fields}
        onSubmit={handleSubmit}
        submitLabel={form.submit_label || 'Submit'}
        id={form.id}
        blockFormId={blockFormId}
      />
    </Card>
  );
};

export default FormBuilder;
