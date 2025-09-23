import { createContext, useContext, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

type ModalContextType = {
  openModal: (content: ReactNode, title?: string) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalContent, setModalContent] = useState<ReactNode | null>(null);
  const [modalTitle, setModalTitle] = useState<string | undefined>(undefined);

  const openModal = (content: ReactNode, title?: string) => {
    setModalContent(content);
    setModalTitle(title);
  };

  const closeModal = () => {
    setModalContent(null);
    setModalTitle(undefined);
  };

  const modalRoot =
    typeof document !== 'undefined'
      ? document.getElementById('modal-root')
      : null;

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      {modalRoot &&
        createPortal(
          <AnimatePresence>
            {modalContent && (
              <motion.div
                key="backdrop"
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs"
                onClick={closeModal}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  key="modal"
                  initial={{ scale: 0.75 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.75 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full max-w-md rounded bg-white p-4 shadow-lg md:p-8"
                  onClick={(e) => e.stopPropagation()}
                >
                  {modalTitle && (
                    <h2 className="mb-4 text-2xl font-semibold">
                      {modalTitle}
                    </h2>
                  )}
                  <button
                    onClick={closeModal}
                    className="absolute top-2 right-2 cursor-pointer text-gray-500 transition-colors hover:text-gray-800"
                  >
                    <X size={32} />
                  </button>
                  {modalContent}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>,
          modalRoot,
        )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used inside a ModalProvider');
  return context;
}
