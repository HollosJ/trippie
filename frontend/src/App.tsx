import { RouterProvider } from '@tanstack/react-router';
import { AuthProvider, useAuth } from './context/AuthProvider';
import { router } from './router';
import { ModalProvider } from './context/ModalProvider';
import { useEffect, useRef } from 'react';

function InnerApp() {
  const auth = useAuth();
  const wasAuthenticated = useRef(auth.isAuthenticated);

  useEffect(() => {
    if (wasAuthenticated.current && !auth.isAuthenticated) {
      router.navigate({ to: '/login' });
    }
    wasAuthenticated.current = auth.isAuthenticated;
  }, [auth.isAuthenticated]);

  return <RouterProvider router={router} context={{ auth }} />;
}

function App() {
  return (
    <AuthProvider>
      <ModalProvider>
        <InnerApp />
      </ModalProvider>
    </AuthProvider>
  );
}

export default App;
