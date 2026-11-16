import {
  Hero as LibraryHero,
  HeroActions,
  HeroContent,
  HeroDescription,
  HeroImage,
  HeroTitle,
  Typography,
} from '@noactionjaxn/another-react-tailwind-component-library';
import ButtonGroup from '@/components/blocks/ButtonGroup';
import { getDirectusAssetURL } from '@/lib/directus/directus-utils';
import { getIsDraftPreview, setBlockAttr } from '@/lib/directus/visualEditing';
import type { ButtonProps } from '@/components/blocks/Button';

/** `image_center` is the pre-library value; it renders as `full`. */
type LayoutOption = 'image_left' | 'image_right' | 'full' | 'image_center';

interface HeroProps {
  data: {
    id: string;
    tagline: string;
    headline: string;
    description: string;
    layout: LayoutOption;
    image: string;
    button_group?: {
      id: string;
      buttons?: ButtonProps[];
    };
  };
}

export default function Hero({ data }: HeroProps) {
  const { id, layout, tagline, headline, description, image, button_group } = data;
  const isFull = layout === 'full' || layout === 'image_center';
  const imageFirst = layout === 'image_left';
  const hasButtons = !!button_group?.buttons?.length;
  const isDraftPreview = getIsDraftPreview();

  const attr = (fields: string | string[], mode: 'popover' | 'modal' = 'popover') =>
    setBlockAttr({ blockCollection: 'block_hero', blockItemId: id, fields, mode });

  const heroImage = image ? (
    <HeroImage
      src={getDirectusAssetURL(image)}
      alt={tagline || headline || 'Hero image'}
      fit={isFull ? 'cover' : 'contain'}
      data-directus={attr(['image', 'layout'], 'modal')}
    />
  ) : null;

  return (
    <LibraryHero full={isFull}>
      {imageFirst && heroImage}
      <HeroContent>
        {tagline && (
          <Typography asChild size="lg" className="font-medium tracking-wide uppercase">
            <p data-directus={attr('tagline')}>{tagline}</p>
          </Typography>
        )}
        <HeroTitle data-directus={attr('headline')}>{headline}</HeroTitle>
        {description && (
          <HeroDescription asChild>
            <div
              className="prose max-w-none [color:inherit]"
              dangerouslySetInnerHTML={{ __html: description }}
              data-directus={attr('description')}
            />
          </HeroDescription>
        )}
        {hasButtons && (
          <HeroActions
            data-directus={setBlockAttr(
              isDraftPreview
                ? { blockCollection: 'block_hero', blockItemId: id, fields: 'button_group', mode: 'modal' }
                : {
                    blockCollection: 'block_button_group',
                    blockItemId: button_group!.id,
                    fields: 'buttons',
                    mode: 'modal',
                  },
            )}
          >
            <ButtonGroup buttons={button_group!.buttons!} />
          </HeroActions>
        )}
      </HeroContent>
      {!imageFirst && heroImage}
    </LibraryHero>
  );
}
