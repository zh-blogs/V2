import { useRoutes } from 'react-router-dom';

import AboutPage from './About';
import AllPage from './All';
import FeaturedPage from './Featured';
import RandomPage from './Random';

const NavRoutes = () => {
  const element = useRoutes([
    { path: '', element: <FeaturedPage /> },
    { path: 'random', element: <RandomPage /> },
    { path: 'all', element: <AllPage /> },
    { path: 'about', element: <AboutPage /> },
  ]);
  return <>{element}</>;
};

export default NavRoutes;
