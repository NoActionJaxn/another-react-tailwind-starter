import { Container, ImageGallery } from '@noactionjaxn/another-react-tailwind-component-library';
import BlockHeading from '@/components/blocks/BlockHeading';
import { getDirectusAssetURL } from '@/lib/directus/directus-utils';
import { setBlockAttr } from '@/lib/directus/visualEditing';

interface GalleryItem {
  id: string;
  directus_file: string;
  sort?: number;
}

interface GalleryProps {
  data: {
    id: string;
    tagline?: string;
    headline?: string;
    items?: GalleryItem[];
  };
}

const Gallery = ({ data }: GalleryProps) => {
  const { tagline, headline, items, id } = data;

  const attr = (fields: string, mode: 'popover' | 'modal' = 'popover') =>
    setBlockAttr({ blockCollection: 'block_gallery', blockItemId: id, fields, mode });

  const galleryItems = (items ?? [])
    .filter((item) => item.directus_file)
    .sort((a, b) => (a.sort ?? 0) - (b.sort ?? 0))
    .map((item, index) => ({
      src: getDirectusAssetURL(item.directus_file),
      alt: headline ? `${headline}, image ${index + 1}` : `Gallery image ${index + 1}`,
    }));

  return (
    <Container asChild>
      <section>
        <BlockHeading
          tagline={tagline}
          headline={headline}
          taglineAttr={attr('tagline')}
          headlineAttr={attr('headline')}
        />
        {galleryItems.length > 0 && (
          <ImageGallery
            items={galleryItems}
            columns={3}
            zoomOnHover
            className="mt-8"
            data-directus={attr('items', 'modal')}
          />
        )}
      </section>
    </Container>
  );
};

export default Gallery;
