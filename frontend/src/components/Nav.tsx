import { useAuth } from '../context/AuthProvider';
import { Link, useNavigate } from '@tanstack/react-router';

export default function Nav() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isLoggedIn = !!user;

  return (
    <nav className="flex items-center justify-between gap-2 border-b bg-white px-2 text-sm">
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
