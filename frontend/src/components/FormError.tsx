type Props = {
  message: string | undefined;
  className?: string;
};

export default function FormError({ message, className }: Props) {
  if (!message) return null;

  return (
    <div className={`text-danger text-sm ${className || ''}`}>{message}</div>
  );
}
