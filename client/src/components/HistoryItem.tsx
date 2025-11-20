import { Clock, ChevronRight, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ScoreDisplay from "./ScoreDisplay";

interface HistoryItemProps {
  id: string;
  productName: string;
  brand: string;
  score: number;
  date: string;
  benefits?: string;
  productImage?: string;
  onClick: () => void;
  onShare?: (e: React.MouseEvent) => void;
}

export default function HistoryItem({ id, productName, brand, score, date, benefits, productImage, onClick, onShare }: HistoryItemProps) {
  const getScoreColor = (score: number) => {
    if (score >= 71) return "bg-primary text-primary-foreground";
    if (score >= 41) return "bg-chart-4 text-white";
    return "bg-destructive text-destructive-foreground";
  };

  return (
    <Card
      className="p-4 hover-elevate"
      data-testid={`history-item-${id}`}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="flex-shrink-0 cursor-pointer" onClick={onClick}>
            <ScoreDisplay score={score} size="sm" />
          </div>

          <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
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
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          {onShare && (
            <Button
              size="default"
              variant="outline"
              onClick={onShare}
              data-testid={`button-share-${id}`}
              className="gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          )}
          <ChevronRight className="w-5 h-5 text-muted-foreground cursor-pointer" onClick={onClick} />
        </div>
      </div>
    </Card>
  );
}
