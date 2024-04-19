import React from 'react';

const Modal = ({ isOpen, setIsOpen, children }) => {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          ></button>

          <div className="container flex items-center justify-center h-full">
            <div className="relative z-10 w-full max-w-screen-sm p-4 bg-white rounded-lg shadow-lg">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
