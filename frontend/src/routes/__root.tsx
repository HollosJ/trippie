import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

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
    return (
      <>
        {/* <Nav /> */}

        {/* Page contents */}
        <Outlet />

        {/* Devtools */}
        <TanStackRouterDevtools />
      </>
    );
  },
});
