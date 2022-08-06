import { useRoutes } from 'react-router-dom';

import NavLayout from '@/components/layout/NavLayout';
import NavRoutes from '@/features/nav/routes';

const AppRouter = () => {
  const element = useRoutes([
    {
      element: <NavLayout />,
      children: [{ path: '/*', element: <NavRoutes /> }],
    },
  ]);
  return <>{element}</>;
};

export default AppRouter;
