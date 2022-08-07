import { BrowserRouter as RouterProvider } from 'react-router-dom';

import IconProvider from './providers/icon';
import QueryProvider from './providers/query';
import AppRouter from './routes';

const App = () => {
  return (
    <QueryProvider>
      <IconProvider>
        <RouterProvider>
          <AppRouter />
        </RouterProvider>
      </IconProvider>
    </QueryProvider>
  );
};

export default App;
