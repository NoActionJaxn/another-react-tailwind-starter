'use client';

import { forwardRef } from 'react';
import {
  Header,
  HeaderLogo,
  HeaderNav,
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@noactionjaxn/another-react-tailwind-component-library';
import SearchModal from '@/components/ui/SearchModal';
import { setAttr } from '@/lib/directus/visualEditing';

interface NavLink {
  id: string;
  title: string;
  url?: string;
  page?: { permalink: string };
}

interface NavigationBarProps {
  navigation: {
    id: string;
    items: (NavLink & { children?: NavLink[] })[];
  };
  globals: {
    logo?: string;
    logo_dark_mode?: string;
  };
}

const hrefFor = (link: NavLink) => link.page?.permalink || link.url || '#';

/**
 * Site header on the library Header + NavigationMenu, which collapses to a hamburger
 * panel below `md`. The ref goes on a `display: contents` wrapper: Header keeps its own
 * ref for positioning that panel, and the wrapper adds no box, so `sticky` still works.
 */
const NavigationBar = forwardRef<HTMLDivElement, NavigationBarProps>(({ navigation, globals }, ref) => {
  const directusURL = import.meta.env.PUBLIC_DIRECTUS_URL;
  const logoUrl = globals?.logo ? `${directusURL}/assets/${globals.logo}` : '/images/logo.svg';

  return (
    <div ref={ref} className="contents">
      <Header sticky className="z-[60]">
        <HeaderLogo asChild>
          <a href="/" aria-label="Home">
            <img src={logoUrl} alt="Logo" className="h-auto w-[120px]" />
          </a>
        </HeaderLogo>
        <HeaderNav>
          <NavigationMenu
            aria-label="Main"
            data-directus={
              navigation
                ? setAttr({ collection: 'navigation', item: navigation.id, fields: ['items'], mode: 'modal' })
                : undefined
            }
          >
            <NavigationMenuList>
              {navigation?.items?.map((section) =>
                section.children?.length ? (
                  <NavigationMenuItem key={section.id}>
                    <NavigationMenuTrigger>{section.title}</NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid w-56 gap-1">
                        {section.children.map((child) => (
                          <li key={child.id}>
                            <NavigationMenuLink href={hrefFor(child)}>{child.title}</NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ) : (
                  <NavigationMenuItem key={section.id}>
                    <NavigationMenuLink href={hrefFor(section)}>{section.title}</NavigationMenuLink>
                  </NavigationMenuItem>
                ),
              )}
            </NavigationMenuList>
          </NavigationMenu>
          <SearchModal />
        </HeaderNav>
      </Header>
    </div>
  );
});

NavigationBar.displayName = 'NavigationBar';

export default NavigationBar;
