import {
  createRootRouteWithContext,
  Outlet,
  useLocation,
} from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import Nav from '../components/Nav';

interface AuthState {
  isAuthenticated: boolean;
  user: { id: string; email: string } | null;
  register: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface MyRouterContext {
  auth: AuthState;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => {
    const { pathname } = useLocation();

    const tripPageRegex = /\/trips\/\d+$/;

    return (
      <>
        {!tripPageRegex.test(pathname) && <Nav />}

        {/* Page contents */}
        <Outlet />

        {/* Devtools */}
        <TanStackRouterDevtools />
      </>
    );
  },
});
