import { Outlet, useLocation } from 'react-router-dom';

import Box from '../elements/Box';
import TabItem from '../elements/TabItem';
import LayoutBase from './LayoutBase';

const tabs = [
  { name: '精选博客', path: '/' },
  { name: '随机博客', path: '/random' },
  { name: '博客一览', path: '/all' },
  { name: '关于我们', path: '/about' },
];

const NavLayout = () => {
  const { pathname } = useLocation();

  return (
    <LayoutBase>
      <Box className="h-[59px]">
        <nav className="flex gap-10 justify-center">
          {tabs.map((tab, index) => (
            <TabItem key={index} to={tab.path} selected={pathname === tab.path}>
              {tab.name}
            </TabItem>
          ))}
        </nav>
      </Box>
      <Box className="min-h-[498px]">
        <main className="my-7 mx-16">
          <Outlet />
        </main>
      </Box>
    </LayoutBase>
  );
};

export default NavLayout;
