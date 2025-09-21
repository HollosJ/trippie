import { motion } from 'framer-motion';

type DropIndicatorProps = {
  beforeId: number | null;
  column: string;
};

export default function DropIndicator({
  beforeId,
  column,
}: DropIndicatorProps) {
  return (
    <motion.div
      layout
      data-before={beforeId || '-1'}
      data-column={column}
      className="bg-primary pointer-events-none relative z-100 my-1 h-1 w-full rounded-full opacity-0 transition-opacity"
    />
  );
}
