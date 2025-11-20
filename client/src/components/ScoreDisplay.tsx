import { Progress } from "@/components/ui/progress";

interface ScoreDisplayProps {
  score: number;
  size?: "sm" | "lg";
}

export default function ScoreDisplay({ score, size = "lg" }: ScoreDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 71) return "text-primary";
    if (score >= 41) return "text-chart-4";
    return "text-destructive";
  };

  const getScoreGradient = (score: number) => {
    if (score >= 71) return "from-primary/20 to-primary/5";
    if (score >= 41) return "from-chart-4/20 to-chart-4/5";
    return "from-destructive/20 to-destructive/5";
  };

  const dimensions = size === "lg" ? "w-48 h-48" : "w-24 h-24";
  const textSize = size === "lg" ? "text-6xl" : "text-3xl";
  const labelSize = size === "lg" ? "text-sm" : "text-xs";

  return (
    <div className="flex flex-col items-center gap-3" data-testid="score-display">
      <div className={`${dimensions} relative flex items-center justify-center`}>
        <svg className="absolute inset-0 -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted/30"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke="currentColor"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${score * 2.827} 283`}
            className={score >= 71 ? "text-primary" : score >= 41 ? "text-chart-4" : "text-destructive"}
          />
        </svg>
        <div className={`flex flex-col items-center justify-center bg-gradient-to-b ${getScoreGradient(score)} rounded-full ${dimensions} border border-border`}>
          <div className={`${textSize} font-bold font-heading ${getScoreColor(score)}`} data-testid="text-score">
            {score}
          </div>
          <div className="text-muted-foreground text-sm font-medium">/100</div>
        </div>
      </div>
      {size === "lg" && (
        <div className={`${labelSize} text-muted-foreground font-medium`}>
          Overall Quality Score
        </div>
      )}
    </div>
  );
}
