import { BrowserRouter as RouterProvider } from 'react-router-dom';

import IconProvider from './providers/icon';
import AppRouter from './routes';

const App = () => {
  return (
    <IconProvider>
      <RouterProvider>
        <AppRouter />
      </RouterProvider>
    </IconProvider>
  );
};

export default App;
