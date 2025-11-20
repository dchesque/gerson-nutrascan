import ScoreDisplay from '../ScoreDisplay';

export default function ScoreDisplayExample() {
  return (
    <div className="flex flex-col gap-8 items-center p-8">
      <div>
        <h3 className="text-lg font-semibold mb-4 text-center">High Score</h3>
        <ScoreDisplay score={85} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4 text-center">Medium Score</h3>
        <ScoreDisplay score={55} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4 text-center">Low Score</h3>
        <ScoreDisplay score={28} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4 text-center">Small Size</h3>
        <ScoreDisplay score={75} size="sm" />
      </div>
    </div>
  );
}
