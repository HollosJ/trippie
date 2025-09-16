import { Plane } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="size-12 origin-bottom-right text-emerald-600">
      <Plane className="size-6 origin-bottom-right animate-spin" />
    </div>
  );
}
