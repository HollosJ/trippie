import { Plane } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="text-primary size-12 origin-bottom-right">
      <Plane className="size-6 origin-bottom-right animate-spin" />
    </div>
  );
}
