import { Container } from '@noactionjaxn/another-react-tailwind-component-library';
import {
  Sponsors as LibrarySponsors,
  SponsorsLogo,
} from '@noactionjaxn/another-react-tailwind-component-library/sponsors';
import BlockHeading from '@/components/blocks/BlockHeading';
import { getDirectusAssetURL } from '@/lib/directus/directus-utils';
import { setBlockAttr } from '@/lib/directus/visualEditing';

interface SponsorsProps {
  data: {
    id: string;
    tagline?: string | null;
    headline?: string | null;
    items?: { id: string; sort?: number | null; image?: string | null; name?: string | null; url?: string | null }[];
  };
}

const Sponsors = ({ data }: SponsorsProps) => {
  const { id, tagline, headline } = data;
  const logos = (data.items ?? [])
    .filter((item) => item.image && item.url)
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0));

  const attr = (fields: string, mode: 'popover' | 'modal' = 'popover') =>
    setBlockAttr({ blockCollection: 'block_sponsors', blockItemId: id, fields, mode });

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
        {logos.length > 0 && (
          <LibrarySponsors className="mt-8" data-directus={attr('items', 'modal')}>
            {logos.map((logo) => (
              <SponsorsLogo
                key={logo.id}
                href={logo.url!}
                src={getDirectusAssetURL(logo.image)}
                alt={logo.name || 'Sponsor logo'}
                {...(logo.url!.startsWith('/') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              />
            ))}
          </LibrarySponsors>
        )}
      </section>
    </Container>
  );
};

export default Sponsors;
