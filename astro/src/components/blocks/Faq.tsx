import {
  FaqBlock,
  FaqBlockDescription,
  FaqBlockHeader,
  FaqBlockItem,
  FaqBlockList,
  FaqBlockTitle,
  Typography,
} from '@noactionjaxn/another-react-tailwind-component-library';
import { setBlockAttr } from '@/lib/directus/visualEditing';

interface FaqProps {
  data: {
    id: string;
    tagline?: string | null;
    headline?: string | null;
    description?: string | null;
    layout?: 'stacked' | 'split' | null;
    items?: { question: string; answer: string }[] | null;
  };
}

const Faq = ({ data }: FaqProps) => {
  const { id, tagline, headline, description, layout } = data;
  const items = (data.items ?? []).filter((item) => item?.question);

  const attr = (fields: string | string[], mode: 'popover' | 'modal' | 'drawer' = 'popover') =>
    setBlockAttr({ blockCollection: 'block_faq', blockItemId: id, fields, mode });

  return (
    <FaqBlock layout={layout ?? 'stacked'}>
      {(tagline || headline || description) && (
        <FaqBlockHeader>
          {tagline && (
            <Typography asChild size="sm" className="font-medium tracking-wide uppercase">
              <p data-directus={attr('tagline')}>{tagline}</p>
            </Typography>
          )}
          {headline && (
            <FaqBlockTitle asChild>
              <h2 data-directus={attr('headline')}>{headline}</h2>
            </FaqBlockTitle>
          )}
          {description && <FaqBlockDescription data-directus={attr('description')}>{description}</FaqBlockDescription>}
        </FaqBlockHeader>
      )}
      {items.length > 0 && (
        <FaqBlockList data-directus={attr('items', 'drawer')}>
          {items.map((item, index) => (
            <FaqBlockItem key={index} value={String(index)} question={item.question}>
              <p className="whitespace-pre-line">{item.answer}</p>
            </FaqBlockItem>
          ))}
        </FaqBlockList>
      )}
    </FaqBlock>
  );
};

export default Faq;
