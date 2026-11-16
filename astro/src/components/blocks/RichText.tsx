import { Container, tw } from '@noactionjaxn/another-react-tailwind-component-library';
import Text from '@/components/ui/Text';
import BlockHeading from '@/components/blocks/BlockHeading';
import { setBlockAttr } from '@/lib/directus/visualEditing';

interface RichTextProps {
  data: {
    id: string;
    tagline?: string;
    headline?: string;
    content?: string;
    alignment?: 'left' | 'center' | 'right';
  };
  className?: string;
}

const alignments = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

const RichText = ({ data, className }: RichTextProps) => {
  const { id, tagline, headline, content, alignment = 'left' } = data;

  return (
    <Container>
      <div className={tw('mx-auto max-w-[600px] space-y-6', alignments[alignment] ?? alignments.left, className)}>
        <BlockHeading
          tagline={tagline}
          headline={headline}
          taglineAttr={setBlockAttr({
            blockCollection: 'block_richtext',
            blockItemId: id,
            fields: 'tagline',
            mode: 'popover',
          })}
          headlineAttr={setBlockAttr({
            blockCollection: 'block_richtext',
            blockItemId: id,
            fields: 'headline',
            mode: 'popover',
          })}
        />
        {content && (
          <Text
            content={content}
            data-directus={setBlockAttr({
              blockCollection: 'block_richtext',
              blockItemId: id,
              fields: 'content',
              mode: 'drawer',
            })}
          />
        )}
      </div>
    </Container>
  );
};

export default RichText;
