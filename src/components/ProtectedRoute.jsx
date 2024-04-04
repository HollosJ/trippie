import { useEffect } from 'react';
import supabaseClient from '../utils/supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate('/login');
      }
    });
  }, [navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;
