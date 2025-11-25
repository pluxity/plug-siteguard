interface CCTVProps {
  id: number;
  className?: string;
}

export default function CCTV({ id, className }: CCTVProps) {
  return (
    <div className={`aspect-video bg-gray-900 rounded-lg flex items-center justify-center ${className || ''}`}>
      <span className="text-gray-500 text-sm">CCTV-{id}</span>
    </div>
  );
}
