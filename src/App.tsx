import IconProvider from './providers/icon';
import AppRouter from './routes';
import { BrowserRouter as RouterProvider } from 'react-router-dom';

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
