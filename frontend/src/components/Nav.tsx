import { useAuth } from '../context/AuthProvider';
import { Link, useNavigate } from '@tanstack/react-router';
import { useModal } from '../context/ModalProvider';

export default function Nav() {
  const { openModal, closeModal } = useModal();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isLoggedIn = !!user;

  const logOutModalContent = () =>
    openModal(
      <>
        <p>Are you sure you want to log out?</p>

        <div className="mt-8 flex justify-end gap-2">
          <button onClick={closeModal} className="btn btn--secondary">
            Cancel
          </button>

          <button
            onClick={() =>
              logout().then(() => {
                navigate({
                  to: '/login',
                });
                closeModal();
              })
            }
            className="btn btn--danger"
          >
            Logout
          </button>
        </div>
      </>,
    );

  return (
    <nav className="text container flex items-center justify-between gap-2 p-4">
      <Link
        to="/"
        className="from-primary bg-gradient-to-r to-emerald-700 bg-clip-text text-3xl font-bold text-transparent"
      >
        Trippie
      </Link>

      <div className="flex gap-4 text-lg">
        {isLoggedIn && (
          <Link to="/trips" className="[&.active]:text-primary">
            My Trips
          </Link>
        )}

        {isLoggedIn ? (
          <button onClick={logOutModalContent}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
}
