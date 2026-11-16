import React from 'react';
import Form from './Form';
import Gallery from './Gallery';
import Posts from './Posts';
import Hero from './Hero';
import RichText from './RichText';
import Pricing from './Pricing';
import CallToAction from './CallToAction';
import Faq from './Faq';
import Sponsors from './Sponsors';
import Testimonials from './Testimonials';
import type { PageBlock } from '@/types/directus-schema';

interface BaseBlockProps {
  block: PageBlock;
}

export default function BaseBlock({ block }: BaseBlockProps) {
  if (!block.collection || !block.item) return null;

  const components: Record<string, React.ElementType> = {
    block_hero: Hero,
    block_gallery: Gallery,
    block_posts: Posts,
    block_form: Form,
    block_richtext: RichText,
    block_pricing: Pricing,
    block_cta: CallToAction,
    block_faq: Faq,
    block_sponsors: Sponsors,
    block_accolades: Testimonials,
  };

  const Component = components[block.collection];

  return Component ? <Component data={block.item} /> : null;
}
