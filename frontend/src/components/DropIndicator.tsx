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
      className="pointer-events-none relative z-100 h-1 w-full rounded-full bg-emerald-400 opacity-0 transition-opacity"
    />
  );
}
