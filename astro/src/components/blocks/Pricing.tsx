import { Container, GridContainer } from '@noactionjaxn/another-react-tailwind-component-library';
import BlockHeading from '@/components/blocks/BlockHeading';
import PricingCard, { type PricingCardProps } from '@/components/blocks/PricingCard';
import { setBlockAttr } from '@/lib/directus/visualEditing';

interface PricingProps {
  data: {
    id: string;
    tagline?: string;
    headline?: string;
    pricing_cards: PricingCardProps['card'][];
  };
}

const Pricing = ({ data }: PricingProps) => {
  const { id, tagline, headline, pricing_cards } = data;

  if (!pricing_cards || !Array.isArray(pricing_cards)) {
    return null;
  }

  const attr = (fields: string | string[], mode: 'popover' | 'modal' = 'popover') =>
    setBlockAttr({ blockCollection: 'block_pricing', blockItemId: id, fields, mode });

  // One card fills the row; multiples of three get three columns; otherwise two.
  const columns = pricing_cards.length === 1 ? 1 : pricing_cards.length % 3 === 0 ? 3 : 2;

  return (
    <Container asChild>
      <section>
        <BlockHeading
          tagline={tagline}
          headline={headline}
          taglineAttr={attr('tagline')}
          headlineAttr={attr('headline')}
        />
        <GridContainer
          block
          columns={columns}
          minColumnWidth="16rem"
          gap="lg"
          className="mt-8 px-0"
          data-directus={attr(['pricing_cards'], 'modal')}
        >
          {pricing_cards.map((card) => (
            <PricingCard key={card.id} card={card} />
          ))}
        </GridContainer>
      </section>
    </Container>
  );
};

export default Pricing;
