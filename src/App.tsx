import { Component } from 'react';
import Layout from './components/layout/layout';
import ErrorBoundary from './components/errorBoundary/errorBoundary';

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <Layout />
      </ErrorBoundary>
    );
  }
}

export default App;
