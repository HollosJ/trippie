type DropIndicatorProps = {
  beforeId: number | null;
  column: string;
};

export default function DropIndicator({
  beforeId,
  column,
}: DropIndicatorProps) {
  return (
    <div
      data-before={beforeId || '-1'}
      data-column={column}
      className="relative z-100 my-0.5 h-0.5 w-full rounded-full bg-emerald-400 opacity-0 transition-opacity"
    />
  );
}
