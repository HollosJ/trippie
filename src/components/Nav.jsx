import { useState } from 'react';
import signInWithGoogle from '../utils/supabase/signInWithGoogle';
import supabaseClient from '../utils/supabase/supabaseClient';
import { Bars3Icon, PlusIcon, XMarkIcon } from '@heroicons/react/24/solid';

const Nav = ({ session }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  function openMenu() {
    setMenuOpen(true);
    document.body.style.overflowY = 'hidden';
  }

  function closeMenu() {
    setMenuOpen(false);
    document.body.style.overflowY = 'auto';
  }

  return (
    <nav className="relative z-50 bg-white shadow-sm">
      <div className="container flex items-center justify-between py-2">
        <a
          className="text-xl font-bold text-transparent md:text-3xl whitespace-nowrap bg-clip-text gradient--green"
          href={session ? '/trips' : '/'}
        >
          Trippie
        </a>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          {/* Add new trip */}
          {session && (
            <a
              href="/trips/new"
              className="flex items-center gap-2 button button--primary"
            >
              New <PlusIcon width="20" height="20" />
            </a>
          )}

          {/* Nav toggle */}
          <button className="" onClick={openMenu}>
            <Bars3Icon className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div className="fixed top-0 right-0 w-screen h-screen contents">
        {/* Backdrop */}
        <button
          className={`absolute left-0 w-screen h-screen top-0 transition ${
            menuOpen
              ? 'bg-slate-900/25 backdrop-blur-sm'
              : 'pointer-events-none'
          }`}
          onClick={closeMenu}
        ></button>

        <aside
          className={`h-screen w-64 content-start items-start absolute top-0 grid overflow-y-auto gap-4 transition-all bg-white p-4 ${
            menuOpen ? 'right-0' : '-right-full'
          }`}
        >
          <button
            className="cursor-pointer justify-self-end"
            onClick={closeMenu}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <div className="grid items-start gap-2">
            {/* Add new trip */}
            {session && (
              <>
                <a
                  href="/trips/new"
                  className="flex items-center gap-2 button"
                  onClick={closeMenu}
                >
                  New <PlusIcon width="20" height="20" />
                </a>

                <a href="/trips" className="button button--primary">
                  My Trips
                </a>

                <button
                  onClick={async () => {
                    await supabaseClient.auth.signOut();
                    closeMenu();

                    // Redirect to home
                    window.location.href = '/';
                  }}
                  className="flex items-center gap-2 button button--secondary"
                >
                  {/* Sign out and google avatar */}
                  Sign Out{' '}
                  <img
                    className="w-4 h-4 rounded-full"
                    src={session.user.user_metadata.avatar_url}
                    alt={session.user.email}
                  />
                </button>
              </>
            )}

            {/* Auth */}
            {!session && (
              <button
                onClick={() => signInWithGoogle()}
                className="flex items-center gap-2 button button--primary"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </aside>
      </div>
    </nav>
  );
};

export default Nav;
