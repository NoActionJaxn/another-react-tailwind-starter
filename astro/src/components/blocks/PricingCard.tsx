import { PriceCard, tw } from '@noactionjaxn/another-react-tailwind-component-library';
import { CheckCircle2 } from 'lucide-react';
import { getButtonHref, toButtonVariant } from '@/components/blocks/Button';
import { getIsDraftPreview, setBlockAttr } from '@/lib/directus/visualEditing';

export interface PricingCardProps {
  card: {
    id: string;
    title: string;
    description?: string;
    price?: string;
    badge?: string;
    features?: string[];
    button?: {
      id: string;
      label: string | null;
      variant: string | null;
      url: string | null;
      type?: 'page' | 'post' | 'url' | null;
      page?: { permalink: string | null };
      post?: { slug: string | null };
    };
    is_highlighted?: boolean;
  };
}

const PricingCard = ({ card }: PricingCardProps) => {
  const isDraftPreview = getIsDraftPreview();

  // Published: target the card item. Draft: pageFields gives setBlockAttr the nested M2A path.
  const cardAttr = (field: string) =>
    setBlockAttr({
      blockCollection: 'block_pricing_cards',
      blockItemId: card.id,
      pageFields: `blocks.item:block_pricing.pricing_cards.${field}`,
      fields: [field],
      mode: 'popover',
    });

  const buttonFields = ['type', 'label', 'variant', 'url', 'page', 'post'];
  const buttonAttr = card.button
    ? setBlockAttr(
        isDraftPreview
          ? {
              blockCollection: 'block_pricing',
              blockItemId: card.id,
              pageFields: 'blocks.item:block_pricing.pricing_cards.button',
              fields: buttonFields,
              mode: 'popover',
            }
          : { blockCollection: 'block_button', blockItemId: card.button.id, fields: buttonFields, mode: 'popover' },
      )
    : undefined;

  const href = card.button ? getButtonHref(card.button) : undefined;
  const external = !!href && !href.startsWith('/');

  return (
    <PriceCard
      className={tw('h-full', card.is_highlighted && 'ring-2 ring-default-900')}
      title={<span data-directus={cardAttr('title')}>{card.title}</span>}
      badge={card.badge ? <span data-directus={cardAttr('badge')}>{card.badge}</span> : undefined}
      badgeProps={{ variant: card.is_highlighted ? 'solid' : 'soft' }}
      price={<span data-directus={cardAttr('price')}>{card.price}</span>}
      buttonLabel={
        href ? (
          <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
            {card.button?.label}
          </a>
        ) : (
          card.button?.label
        )
      }
      buttonProps={{
        asChild: !!href,
        variant: toButtonVariant(card.button?.variant),
        // data-* attributes aren't in ButtonProps' type, but the Button spreads them onto the element.
        ...({ 'data-directus': buttonAttr } as object),
      }}
    >
      {card.description && (
        <p className="line-clamp-2" data-directus={cardAttr('description')}>
          {card.description}
        </p>
      )}
      {Array.isArray(card.features) && card.features.length > 0 && (
        <ul className="mt-4 space-y-3" data-directus={cardAttr('features')}>
          {card.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 opacity-60" aria-hidden />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      )}
    </PriceCard>
  );
};

export default PricingCard;
