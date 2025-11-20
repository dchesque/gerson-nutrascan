import { Clock, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ScoreDisplay from "./ScoreDisplay";

interface HistoryItemProps {
  id: string;
  productName: string;
  brand: string;
  score: number;
  date: string;
  benefits?: string;
  onClick: () => void;
}

export default function HistoryItem({ id, productName, brand, score, date, benefits, onClick }: HistoryItemProps) {
  const getScoreColor = (score: number) => {
    if (score >= 71) return "bg-primary text-primary-foreground";
    if (score >= 41) return "bg-chart-4 text-white";
    return "bg-destructive text-destructive-foreground";
  };

  return (
    <Card
      className="p-4 hover-elevate cursor-pointer"
      onClick={onClick}
      data-testid={`history-item-${id}`}
    >
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          <ScoreDisplay score={score} size="sm" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-base truncate">{productName}</h4>
          <div className="text-sm text-muted-foreground truncate">{brand}</div>
          {benefits && (
            <div className="text-xs text-primary mt-1 truncate">
              💡 {benefits}
            </div>
          )}
          <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{date}</span>
          </div>
        </div>

        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      </div>
    </Card>
  );
}
