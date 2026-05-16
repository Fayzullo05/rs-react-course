import { Link, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/errorBoundary/errorBoundary';
import MainPage from './pages/main/mainPage';
import AboutPage from './pages/about/aboutPage';
import NotFoundPage from './pages/notFound/notFoundPage';

function App() {
  return (
    <ErrorBoundary>
      <nav>
        <Link to="/">Main</Link>
        <Link to="/about">About</Link>
      </nav>

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
