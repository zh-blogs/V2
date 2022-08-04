import MainLayout from './components/layout/MainLayout';
import IconProvider from './providers/icon';

const App = () => {
  return (
    <IconProvider>
      <MainLayout>
        <div className="text-3xl font-bold underline">Hello world!</div>
      </MainLayout>
    </IconProvider>
  );
};

export default App;
