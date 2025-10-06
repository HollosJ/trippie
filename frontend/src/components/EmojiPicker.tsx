import { useState } from 'react';
import emojis from '../data/emojis';
import { CircleSlash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EmojiPickerProps {
  value: string | null;
  onChange: (emoji: string | null) => void;
}

export default function EmojiPicker({ value, onChange }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleEmojiSelect = (emoji: string | null) => {
    setIsOpen(false);
    onChange(emoji);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="focus:outline-primary flex w-16 items-center justify-center rounded bg-gray-50 px-4 py-2 text-2xl leading-none shadow"
        type="button"
      >
        {value || <CircleSlash className="stroke-primary size-6" />}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            style={{ transformOrigin: 'top center' }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full z-10 mt-2 grid size-64 grid-cols-3 gap-2 overflow-y-auto rounded bg-gray-50 p-2 shadow"
          >
            <button
              onClick={() => handleEmojiSelect(null)}
              className={`flex items-center justify-center rounded bg-gray-200 p-2 hover:bg-gray-300 ${!value ? 'bg-gray-400' : ''}`}
              type="button"
              title={'None'}
            >
              <CircleSlash className="size-5" />
            </button>

            {emojis.map((emoji) => (
              <button
                key={emoji.emoji}
                onClick={() => handleEmojiSelect(emoji.emoji)}
                className={`text flex items-center justify-center rounded bg-gray-100 p-2 text-xl hover:bg-gray-200 ${value === emoji.emoji ? 'ring-primary ring-2' : ''}`}
                type="button"
                title={emoji.label}
              >
                {emoji.emoji}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
