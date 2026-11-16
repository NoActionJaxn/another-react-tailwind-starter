import { Container } from '@noactionjaxn/another-react-tailwind-component-library';
import type { FormField } from '@/types/directus-schema';
import FormBuilder from '@/components/forms/FormBuilder';
import BlockHeading from '@/components/blocks/BlockHeading';
import { setBlockAttr } from '@/lib/directus/visualEditing';

interface FormBlockProps {
  data: {
    id: string;
    tagline: string | null;
    headline: string | null;
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
  };
}

const FormBlock = ({ data }: FormBlockProps) => {
  const { tagline, headline, form } = data;

  if (!form) {
    return null;
  }

  return (
    <Container asChild>
      <section>
        <BlockHeading
          tagline={tagline}
          headline={headline}
          taglineAttr={setBlockAttr({
            blockCollection: 'block_form',
            blockItemId: data.id,
            fields: 'tagline',
            mode: 'popover',
          })}
          headlineAttr={setBlockAttr({
            blockCollection: 'block_form',
            blockItemId: data.id,
            fields: 'headline',
            mode: 'popover',
          })}
        />

        <div
          data-directus={setBlockAttr({
            blockCollection: 'block_form',
            blockItemId: data.id,
            fields: ['form'],
            mode: 'popover',
          })}
        >
          <FormBuilder form={form} blockFormId={data.id} className="mt-8" />
        </div>
      </section>
    </Container>
  );
};

export default FormBlock;
