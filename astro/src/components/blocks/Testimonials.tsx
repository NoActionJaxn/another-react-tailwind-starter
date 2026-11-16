import { Container } from '@noactionjaxn/another-react-tailwind-component-library';
import {
  Accolades,
  AccoladesImage,
  AccoladesItem,
  AccoladesLink,
  AccoladesQuote,
} from '@noactionjaxn/another-react-tailwind-component-library/accolades';
import BlockHeading from '@/components/blocks/BlockHeading';
import { getDirectusAssetURL } from '@/lib/directus/directus-utils';
import { setBlockAttr } from '@/lib/directus/visualEditing';

interface TestimonialsProps {
  data: {
    id: string;
    tagline?: string | null;
    headline?: string | null;
    animation?: 'none' | 'fade' | 'pop' | null;
    items?: {
      id: string;
      sort?: number | null;
      quote?: string | null;
      source?: string | null;
      image?: string | null;
      url?: string | null;
    }[];
  };
}

const Testimonials = ({ data }: TestimonialsProps) => {
  const { id, tagline, headline, animation } = data;
  const items = (data.items ?? []).filter((item) => item.quote).sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));

  const attr = (fields: string, mode: 'popover' | 'modal' = 'popover') =>
    setBlockAttr({ blockCollection: 'block_accolades', blockItemId: id, fields, mode });

  return (
    <Container asChild>
      <section>
        <BlockHeading
          tagline={tagline}
          headline={headline}
          taglineAttr={attr('tagline')}
          headlineAttr={attr('headline')}
          className="text-center"
        />
        {items.length > 0 && (
          <Accolades animation={animation ?? 'fade'} className="mt-8" data-directus={attr('items', 'modal')}>
            {items.map((item) => (
              <AccoladesItem key={item.id}>
                {item.image && <AccoladesImage src={getDirectusAssetURL(item.image)} alt={item.source || ''} />}
                <AccoladesQuote>{item.quote}</AccoladesQuote>
                {item.source &&
                  (item.url ? (
                    <AccoladesLink href={item.url}>{item.source}</AccoladesLink>
                  ) : (
                    <p className="text-sm opacity-70">{item.source}</p>
                  ))}
              </AccoladesItem>
            ))}
          </Accolades>
        )}
      </section>
    </Container>
  );
};

export default Testimonials;
