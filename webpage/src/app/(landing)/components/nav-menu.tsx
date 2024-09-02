import { HamburgerIcon } from '@chakra-ui/icons';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Link,
} from '@chakra-ui/react';
import NextLink from 'next/link';
import { Routes } from './nav';

interface NavMenuProps {
  routes: {
    name: string;
    href: Routes;
  }[];
}

export const NavMenu: React.FC<NavMenuProps> = ({ routes }) => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        aria-label='Options'
        icon={<HamburgerIcon />}
        variant='outline'
        size={'sm'}
      />
      <MenuList>
        {routes.map((route) => (
          <Link as={NextLink} key={route.href} href={route.href}>
            <MenuItem className='capitalize'>{route.name}</MenuItem>
          </Link>
        ))}
      </MenuList>
    </Menu>
  );
};
