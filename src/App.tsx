import IndexLayout from './components/layout/IndexLayout';
import IconProvider from './providers/icon';

const App = () => {
  return (
    <IconProvider>
      <IndexLayout>
        <div className="text-3xl font-bold underline">Hello world!</div>
      </IndexLayout>
    </IconProvider>
  );
};

export default App;
