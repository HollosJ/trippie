import HeroImage from '@/assets/hero-image.svg';

const Home = () => {
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
          <button className="button button--primary">Get Started</button>

          <p className="mt-2 text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="font-semibold text-green-600">
              Login
            </a>
          </p>
        </div>
      </div>

      <img
        src={HeroImage}
        alt="Illustration of a lady with a suitcase next to a tree"
      />
    </div>
  );
};

export default Home;
