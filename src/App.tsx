import Layout from './components/layout/layout';
import ErrorBoundary from './components/errorBoundary/errorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <Layout />
    </ErrorBoundary>
  );
}

export default App;
