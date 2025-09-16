import { type FormEvent, type ReactNode } from 'react';

interface FormProps {
  children: ReactNode;
  className?: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function Form({ children, onSubmit, className }: FormProps) {
  return (
    <form className={`${className || ''}`} onSubmit={onSubmit}>
      {children}
    </form>
  );
}
