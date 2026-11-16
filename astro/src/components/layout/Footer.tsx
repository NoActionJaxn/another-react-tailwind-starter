'use client';

import { forwardRef } from 'react';
import {
  FooterBar,
  FooterBrand,
  FooterColumn,
  FooterDescription,
  FooterLink,
  FooterMain,
  FooterSocialLink,
  FooterSocials,
  Footer as LibraryFooter,
} from '@noactionjaxn/another-react-tailwind-component-library';
import SocialIcon from '@/components/ui/SocialIcon';
import { setAttr } from '@/lib/directus/visualEditing';

interface SocialLink {
  service: string;
  url: string;
}

interface NavigationItem {
  id: string;
  title: string;
  url?: string | null;
  page?: { permalink?: string | null };
}

interface FooterProps {
  navigation: { id?: string; items: NavigationItem[] };
  globals: {
    title?: string | null;
    logo?: string | null;
    description?: string | null;
    social_links?: SocialLink[];
  };
}

/**
 * Site footer on the library Footer. The ref goes on a `display: contents` wrapper
 * (used for Directus visual editing), since the library Footer doesn't forward one.
 */
const Footer = forwardRef<HTMLDivElement, FooterProps>(({ navigation, globals }, ref) => {
  const directusURL = import.meta.env.PUBLIC_DIRECTUS_URL;
  const logoUrl = globals?.logo ? `${directusURL}/assets/${globals.logo}` : '/images/logo.svg';
  const items = navigation?.items ?? [];
  const socials = globals?.social_links ?? [];

  return (
    <div ref={ref} className="contents">
      <LibraryFooter variant="soft">
        <FooterMain>
          <FooterBrand>
            <a href="/" aria-label="Home" className="inline-block transition-opacity hover:opacity-70">
              <img src={logoUrl} alt="Logo" className="h-auto w-[120px]" />
            </a>
            {globals?.description && <FooterDescription>{globals.description}</FooterDescription>}
          </FooterBrand>
          {items.length > 0 && (
            <FooterColumn
              title="Navigation"
              data-directus={
                navigation.id
                  ? setAttr({ collection: 'navigation', item: navigation.id, fields: ['items'], mode: 'modal' })
                  : undefined
              }
            >
              {items.map((item) => (
                <FooterLink key={item.id ?? item.title} href={item.page?.permalink || item.url || '#'}>
                  {item.title}
                </FooterLink>
              ))}
            </FooterColumn>
          )}
        </FooterMain>
        <FooterBar>
          <p>
            © {new Date().getFullYear()} {globals?.title}
          </p>
          {socials.length > 0 && (
            <FooterSocials>
              {socials.map((social) => (
                <FooterSocialLink
                  key={social.service}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.service}
                  icon={<SocialIcon service={social.service} size={20} alt="" className="size-5" />}
                />
              ))}
            </FooterSocials>
          )}
        </FooterBar>
      </LibraryFooter>
    </div>
  );
});

Footer.displayName = 'Footer';

export default Footer;
