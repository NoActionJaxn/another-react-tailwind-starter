import {
  Button as LibraryButton,
  type ButtonSize,
  type ButtonVariant,
} from '@noactionjaxn/another-react-tailwind-component-library';
import { type LucideIcon, ArrowRight, Plus } from 'lucide-react';

/** Variant values stored in Directus (block_button.variant). */
export type DirectusButtonVariant = 'default' | 'outline' | 'soft' | 'ghost' | 'link';

export interface ButtonProps {
  id: string;
  label?: string | null;
  url?: string | null;
  type?: 'page' | 'post' | 'url' | 'submit' | null;
  page?: { permalink: string | null };
  post?: { slug: string | null };
  size?: ButtonSize;
  variant?: DirectusButtonVariant | ButtonVariant | string | null;
  icon?: 'arrow' | 'plus';
  customIcon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  block?: boolean;
  'data-directus'?: string;
}

const variantMap: Record<string, ButtonVariant> = {
  default: 'solid',
  solid: 'solid',
  outline: 'outline',
  soft: 'soft',
  secondary: 'soft',
  ghost: 'ghost',
  link: 'ghost',
};

/** Maps a Directus variant to a library Button variant (solid when unknown). */
export const toButtonVariant = (variant?: string | null): ButtonVariant => variantMap[variant ?? ''] ?? 'solid';

/** Resolves the href for a Directus button: page permalink, post slug, or raw URL. */
export const getButtonHref = ({ type, page, post, url }: Pick<ButtonProps, 'type' | 'page' | 'post' | 'url'>) => {
  if (type === 'page' && page?.permalink) return page.permalink;
  if (type === 'post' && post?.slug) return `/blog/${post.slug}`;

  return url || undefined;
};

const icons: Record<'arrow' | 'plus', LucideIcon> = {
  arrow: ArrowRight,
  plus: Plus,
};

const Button = ({
  label,
  variant,
  url,
  type,
  page,
  post,
  size = 'md',
  icon,
  customIcon,
  iconPosition = 'left',
  className,
  onClick,
  disabled = false,
  block = false,
  'data-directus': dataDirectus,
}: ButtonProps) => {
  const Icon = customIcon || (icon ? icons[icon] : null);
  const href = type === 'submit' ? undefined : getButtonHref({ type, page, post, url });

  const content = (
    <>
      {Icon && iconPosition === 'left' && <Icon className="size-4 shrink-0" />}
      {label && <span>{label}</span>}
      {Icon && iconPosition === 'right' && <Icon className="size-4 shrink-0" />}
    </>
  );

  const shared = {
    variant: toButtonVariant(variant),
    size,
    block,
    className,
    'data-directus': dataDirectus,
  };

  if (href && !disabled) {
    const external = !href.startsWith('/');

    return (
      <LibraryButton asChild {...shared}>
        <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
          {content}
        </a>
      </LibraryButton>
    );
  }

  return (
    <LibraryButton {...shared} type={type === 'submit' ? 'submit' : 'button'} onClick={onClick} disabled={disabled}>
      {content}
    </LibraryButton>
  );
};

export default Button;
