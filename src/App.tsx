import { NavLink, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/errorBoundary/errorBoundary';
import MainPage from './pages/main/mainPage';
import AboutPage from './pages/about/aboutPage';
import NotFoundPage from './pages/notFound/notFoundPage';
import DetailsPage from './pages/details/detailsPage';
import styles from './App.module.css';
import ThemeSwitcher from './components/themeSwitcher/themeSwitcher';

function App() {
  const getNavLinkClassName = ({ isActive }: { isActive: boolean }) => {
    return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
  };

  return (
    <ErrorBoundary>
      <nav className={styles.nav}>
        <NavLink className={getNavLinkClassName} to="/">
          Main
        </NavLink>
        <NavLink className={getNavLinkClassName} to="/about">
          About
        </NavLink>
        <ThemeSwitcher />
      </nav>

      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/details/:id" element={<MainPage />}>
          <Route index element={<DetailsPage />} />
        </Route>
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
