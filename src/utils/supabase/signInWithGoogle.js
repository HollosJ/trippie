import supabaseClient from './supabaseClient';

const signInWithGoogle = async () => {
  try {
    const { error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/trips`,
      },
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
