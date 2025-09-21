import { useAuth } from '../context/AuthProvider';
import { Link, useNavigate } from '@tanstack/react-router';
import { useModal } from '../context/ModalProvider';

export default function Nav() {
  const { openModal, closeModal } = useModal();
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

                'Logout',
              );
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
