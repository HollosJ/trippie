import React from 'react';

const Modal = ({ trigger, setTrigger, children }) => {
  return (
    <>
      {trigger && (
        <div className="fixed inset-0 z-50">
          <button
            className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"
            onClick={() => setTrigger(false)}
          ></button>

          <div className="container flex items-center justify-center h-full">
            <div className="relative z-10 w-full max-w-screen-sm p-4 bg-white rounded-lg shadow-lg">
              <button
                className="absolute top-4 right-4"
                onClick={() => setTrigger(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
