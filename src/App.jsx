import React, { useEffect, useState } from 'react';
import supabaseClient from './utils/supabase/supabaseClient.js';
import { Toaster, toast } from 'sonner';

import Home from './pages/home.jsx';
import Trips from './pages/trips.jsx';
import Trip from './pages/trip.jsx';
import NewTrip from './pages/new.jsx';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Nav from './components/Nav.jsx';
import { Auth } from '@supabase/auth-ui-react';
import ProtectedRoute from './components/ProtectedRoute.jsx';

const App = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <Home />,
    },
    {
      path: 'trips',
      element: (
        <ProtectedRoute>
          <Trips />
        </ProtectedRoute>
      ),
    },
    {
      path: 'trips/:id',
      element: (
        <ProtectedRoute>
          <Trip />
        </ProtectedRoute>
      ),
    },
    {
      path: 'trips/new',
      element: (
        <ProtectedRoute>
          <NewTrip />
        </ProtectedRoute>
      ),
    },
    {
      path: 'login',
      element: (
        <Auth
          supabaseClient={supabaseClient}
          providers={['google']}
          redirectTo={`${window.location.origin}/trips`}
          onlyThirdPartyProviders={true}
        />
      ),
    },
  ]);

  return (
    <>
      <Toaster position="bottom-center" richColors />

      <div className="flex flex-col min-h-screen overflow-x-hidden">
        <Nav session={session} />

        <RouterProvider router={router} />
      </div>
    </>
  );
};

export default App;
