import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <main>
      <h1>404</h1>
      <p>Page not found</p>
      <Link to="/">Return to main page</Link>
    </main>
  );
}

export default NotFoundPage;
