import { Info, CheckCircle2, AlertCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface IngredientCardProps {
  name: string;
  actualDosage: string;
  idealDosage: string;
  percentage: number;
  efficacy: "high" | "medium" | "low";
  explanation: string;
}

export default function IngredientCard({
  name,
  actualDosage,
  idealDosage,
  percentage,
  efficacy,
  explanation,
}: IngredientCardProps) {
  const getEfficacyColor = () => {
    if (efficacy === "high") return "text-primary";
    if (efficacy === "medium") return "text-chart-4";
    return "text-destructive";
  };

  const getEfficacyIcon = () => {
    if (efficacy === "high") return <CheckCircle2 className="w-5 h-5" />;
    if (efficacy === "medium") return <AlertCircle className="w-5 h-5" />;
    return <XCircle className="w-5 h-5" />;
  };

  const getProgressColor = () => {
    if (percentage >= 80) return "bg-primary";
    if (percentage >= 50) return "bg-chart-4";
    return "bg-destructive";
  };

  return (
    <Card className="p-4" data-testid={`ingredient-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h4 className="font-semibold text-base mb-1">{name}</h4>
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{actualDosage}</span>
            <span className="mx-2">/</span>
            <span>Ideal: {idealDosage}</span>
          </div>
        </div>
        <div className={`${getEfficacyColor()} flex items-center gap-1`}>
          {getEfficacyIcon()}
        </div>
      </div>

      <div className="space-y-2 mb-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Dosage adequacy</span>
          <span className={`font-semibold ${getEfficacyColor()}`} data-testid={`percentage-${name.toLowerCase().replace(/\s+/g, '-')}`}>
            {percentage}%
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full ${getProgressColor()} transition-all duration-500`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="details" className="border-none">
          <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground py-2" data-testid={`button-details-${name.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4" />
              <span>Scientific rationale</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-sm text-muted-foreground pt-2">
            {explanation}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
