import { type FormEvent, type ReactNode } from "react";

interface FormProps {
  children: ReactNode;
  className?: string;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

export default function Form({ children, onSubmit, className }: FormProps) {
  return (
    <form
      className={`bg-white p-4 md:p-8 border rounded ${className || ""}`}
      onSubmit={onSubmit}
    >
      {children}
    </form>
  );
}
