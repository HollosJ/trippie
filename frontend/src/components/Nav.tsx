import { useAuth } from '../providers/auth';
import { Link } from '@tanstack/react-router';

export default function Nav() {
  const { user, logout } = useAuth();

  const isLoggedIn = !!user;

  return (
    <nav className="border-b px-2 flex items-center justify-between gap-2 bg-white text-sm">
      <div className="flex gap-2">
        <Link to="/" className="[&.active]:font-bold">
          Home
        </Link>

        {isLoggedIn && (
          <Link to="/trips" className="[&.active]:font-bold">
            Trips
          </Link>
        )}
      </div>

      <div className="flex gap-2">
        {isLoggedIn ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
