export default function ProgressCard() {
  return (
    <div className="space-y-4">
      <div>
        <div className="text-sm text-gray-500">계획 공정률</div>
        <div className="text-4xl font-bold text-blue-400">45.21%</div>
      </div>
      <div>
        <div className="text-sm text-gray-500">현재 공정률</div>
        <div className="text-4xl font-bold text-blue-400">42.11%</div>
      </div>
    </div>
  );
}
