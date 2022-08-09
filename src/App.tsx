import { BrowserRouter as RouterProvider } from 'react-router-dom';

import IconProvider from './providers/icon';
import LoadingProvider from './providers/loading';
import QueryProvider from './providers/query';
import AppRouter from './routes';

const App = () => {
  return (
    <QueryProvider>
      <IconProvider>
        <LoadingProvider>
          <RouterProvider>
            <AppRouter />
          </RouterProvider>
        </LoadingProvider>
      </IconProvider>
    </QueryProvider>
  );
};

export default App;
