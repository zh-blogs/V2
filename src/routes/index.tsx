import IndexLayout from '@/components/layout/IndexLayout';
import IndexRoutes from '@/features/index/routes';
import { useRoutes } from 'react-router-dom';

const AppRouter = () => {
  const element = useRoutes([
    {
      element: <IndexLayout />,
      children: [{ path: '/*', element: <IndexRoutes /> }],
    },
  ]);
  return <>{element}</>;
};

export default AppRouter;
