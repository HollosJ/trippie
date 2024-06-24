import HeroImage from '@/assets/hero-image.svg';
import signInWithGoogle from '../utils/supabase/signInWithGoogle';

const HomePage = () => {
  return (
    <div className="container grid items-center gap-8 py-8 md:grid-cols-2 md:max-w-screen-lg">
      <div className="grid gap-8 justify-items-start">
        <h1 className="text-3xl font-bold lg:text-5xl">
          Your{' '}
          <span className="text-transparent gradient--green bg-clip-text">
            Ultimate
          </span>{' '}
          Travel Planning Companion!
        </h1>

        {/* CTA */}
        <div className="grid">
          <button className="button button--primary" onClick={signInWithGoogle}>
            Log in
          </button>
        </div>
      </div>

      <img
        src={HeroImage}
        alt="Illustration of a lady with a suitcase next to a tree"
      />
    </div>
  );
};

export default HomePage;
