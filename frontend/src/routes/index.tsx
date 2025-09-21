import { createFileRoute, Link } from '@tanstack/react-router';
import HeroImage from '../assets/hero-image.svg';
import { PlaneIcon } from 'lucide-react';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  return (
    <div className="container my-8 grid items-center md:max-w-screen-lg md:grid-cols-2">
      <div>
        <h1 className="text-5xl">
          The{' '}
          <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
            ultimate
          </span>{' '}
          travel planning companion.
        </h1>

        <Link to="/login" className="btn btn--primary mt-8">
          Get Started <PlaneIcon className="ml-2 size-4" />
        </Link>
      </div>

      <img src={HeroImage} />
    </div>
  );
}
