import { useAuth } from '../context/AuthProvider';
import { Link, useNavigate } from '@tanstack/react-router';

export default function Nav() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isLoggedIn = !!user;

  return (
    <nav className="text container flex items-center justify-between gap-2 p-4">
      <div className="flex gap-2">
        <Link to="/" className="[&.active]:text-primary">
          Home
        </Link>

        {isLoggedIn && (
          <Link to="/trips" className="[&.active]:text-primary">
            Trips
          </Link>
        )}
      </div>

      <div className="flex gap-2">
        {isLoggedIn ? (
          <button
            onClick={() => {
              navigate({ to: '/login' });
              logout();
            }}
          >
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
