import { RouterProvider } from '@tanstack/react-router';
import { AuthProvider, useAuth } from './context/AuthProvider';
import { router } from './router';
import { ModalProvider } from './context/ModalProvider';

function InnerApp() {
  const auth = useAuth();
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
