import { useEffect } from 'react';
import supabaseClient from '../utils/supabase/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        toast.error('You must be logged in to view this page.');
        navigate('/login');
      }
    });
  }, [navigate]);

  return <>{children}</>;
};

export default ProtectedRoute;
