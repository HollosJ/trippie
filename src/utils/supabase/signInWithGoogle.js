import supabaseClient from './supabaseClient';

const signInWithGoogle = async () => {
  try {
    const { user, session, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
    });

    if (error) {
      console.error('Error signing in with Google:', error.message);
      return;
    }
  } catch (error) {
    console.error('Error signing in with Google:', error.message);
  }
};

export default signInWithGoogle;
