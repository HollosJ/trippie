import { AnimatePresence, motion } from 'framer-motion';

type Props = {
  message: string;
  className?: string;
};

export default function ErrorMessage({ message, className }: Props) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          key="server-error"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className={`border-danger rounded border-2 bg-red-400 p-2 text-center font-bold text-white ${className || ''}`}
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
