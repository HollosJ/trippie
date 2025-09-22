import { createFileRoute, Link } from '@tanstack/react-router';
import HeroImage from '../assets/hero-image.svg';
import { PlaneIcon } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="container md:max-w-screen-lg">
      <div className="my-8 grid items-center gap-4 md:my-16 md:grid-cols-2">
        <div>
          <h1 className="text-5xl font-normal text-pretty md:text-7xl">
            The{' '}
            <span className="bg-gradient-to-tr from-emerald-500 to-emerald-700 bg-clip-text font-bold text-transparent">
              ultimate
            </span>{' '}
            travel planning companion.
          </h1>

          <Link to="/login" className="btn btn--primary mt-8 text-lg">
            Get Started <PlaneIcon className="ml-2 size-4" />
          </Link>
        </div>

        <img src={HeroImage} />
      </div>
    </div>
  );
}
