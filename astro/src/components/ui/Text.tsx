import React from 'react';
import { tw } from '@noactionjaxn/another-react-tailwind-component-library';

export interface TextProps {
  content: string;
  className?: string;
  'data-directus'?: string;
}

const Text = ({ content, className, 'data-directus': dataDirectus }: TextProps) => {
  return (
    <div
      className={tw('prose prose-stone', className)}
      dangerouslySetInnerHTML={{ __html: content }}
      data-directus={dataDirectus}
    />
  );
};

export default Text;
