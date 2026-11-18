import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-4 text-center">
    <p className="text-6xl font-extrabold text-crimson-600">404</p>
    <h1 className="mt-3 text-2xl font-bold text-ink-900">Page not found</h1>
    <p className="mt-2 text-sm text-ink-500">
      The page you're looking for doesn't exist or has been moved.
    </p>
    <Link to="/" className="btn-primary mt-6">Back to home</Link>
  </div>
);

export default NotFound;
