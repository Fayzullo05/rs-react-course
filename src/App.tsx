import { NavLink, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/errorBoundary/errorBoundary';
import MainPage from './views/main/mainPage';
import AboutPage from './views/about/aboutPage';
import NotFoundPage from './views/notFound/notFoundPage';
import DetailsPage from './views/details/detailsPage';
import styles from './App.module.css';
import ThemeSwitcher from './components/themeSwitcher/themeSwitcher';
import { RoutePath } from './constants/app';

function App() {
  const getNavLinkClassName = ({ isActive }: { isActive: boolean }) => {
    return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
  };

  return (
    <ErrorBoundary>
      <nav className={styles.nav}>
        <NavLink className={getNavLinkClassName} to={RoutePath.main}>
          Main
        </NavLink>
        <NavLink className={getNavLinkClassName} to={RoutePath.about}>
          About
        </NavLink>
        <ThemeSwitcher />
      </nav>

      <Routes>
        <Route path={RoutePath.main} element={<MainPage />}>
          <Route path={RoutePath.details} element={<DetailsPage />} />
        </Route>
        <Route path={RoutePath.about} element={<AboutPage />} />
        <Route path={RoutePath.notFound} element={<NotFoundPage />} />
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
