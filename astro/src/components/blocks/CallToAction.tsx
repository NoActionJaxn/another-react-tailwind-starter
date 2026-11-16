import {
  CallToAction as LibraryCallToAction,
  CallToActionActions,
  CallToActionContent,
  CallToActionDescription,
  CallToActionTitle,
  Typography,
} from '@noactionjaxn/another-react-tailwind-component-library';
import ButtonGroup from '@/components/blocks/ButtonGroup';
import type { ButtonProps } from '@/components/blocks/Button';
import { getIsDraftPreview, setBlockAttr } from '@/lib/directus/visualEditing';

interface CallToActionProps {
  data: {
    id: string;
    tagline?: string | null;
    headline?: string | null;
    description?: string | null;
    layout?: 'centered' | 'split' | null;
    variant?: 'soft' | 'solid' | 'outline' | 'ghost' | null;
    button_group?: {
      id: string;
      buttons?: ButtonProps[];
    } | null;
  };
}

const CallToAction = ({ data }: CallToActionProps) => {
  const { id, tagline, headline, description, layout, variant, button_group } = data;
  const isDraftPreview = getIsDraftPreview();
  const buttons = button_group?.buttons ?? [];

  const attr = (fields: string | string[], mode: 'popover' | 'modal' = 'popover') =>
    setBlockAttr({ blockCollection: 'block_cta', blockItemId: id, fields, mode });

  return (
    <LibraryCallToAction
      layout={layout ?? 'centered'}
      variant={variant ?? 'soft'}
      data-directus={attr(['layout', 'variant'], 'modal')}
    >
      <CallToActionContent>
        {tagline && (
          <Typography asChild size="sm" className="font-medium tracking-wide uppercase">
            <p data-directus={attr('tagline')}>{tagline}</p>
          </Typography>
        )}
        {headline && (
          <CallToActionTitle asChild>
            <h2 data-directus={attr('headline')}>{headline}</h2>
          </CallToActionTitle>
        )}
        {description && (
          <CallToActionDescription data-directus={attr('description')}>{description}</CallToActionDescription>
        )}
      </CallToActionContent>
      {buttons.length > 0 && (
        <CallToActionActions
          data-directus={setBlockAttr(
            isDraftPreview || !button_group
              ? { blockCollection: 'block_cta', blockItemId: id, fields: 'button_group', mode: 'modal' }
              : {
                  blockCollection: 'block_button_group',
                  blockItemId: button_group.id,
                  fields: 'buttons',
                  mode: 'modal',
                },
          )}
        >
          <ButtonGroup buttons={buttons} />
        </CallToActionActions>
      )}
    </LibraryCallToAction>
  );
};

export default CallToAction;
