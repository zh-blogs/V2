import NavLayout from '@/components/layout/NavLayout';
import NavRoutes from '@/features/nav/routes';
import { useRoutes } from 'react-router-dom';

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
