import { Outlet } from 'react-router-dom';
import Layout from '../../components/layout/layout';

function MainPage() {
  return <Layout detailsSlot={<Outlet />} />;
}

export default MainPage;
