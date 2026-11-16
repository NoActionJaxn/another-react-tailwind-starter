import { Typography } from '@noactionjaxn/another-react-tailwind-component-library';

interface BlockHeadingProps {
  tagline?: string | null;
  headline?: string | null;
  /** data-directus value for the tagline (from setBlockAttr). */
  taglineAttr?: string;
  /** data-directus value for the headline (from setBlockAttr). */
  headlineAttr?: string;
  className?: string;
}

/** The tagline + headline pair that opens most page blocks. */
export default function BlockHeading({ tagline, headline, taglineAttr, headlineAttr, className }: BlockHeadingProps) {
  if (!tagline && !headline) return null;

  return (
    <div className={className}>
      {tagline && (
        <Typography asChild size="lg" className="font-medium tracking-wide uppercase">
          <h2 data-directus={taglineAttr}>{tagline}</h2>
        </Typography>
      )}
      {headline && (
        <Typography asChild size="xxl" className="mt-2 font-semibold tracking-tight">
          <p data-directus={headlineAttr}>{headline}</p>
        </Typography>
      )}
    </div>
  );
}
