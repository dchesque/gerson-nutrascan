import { useState } from "react";
import { Bot, X, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface AIConversationPopupProps {
  open: boolean;
  onClose: () => void;
  onGoalSelect: (goal: string) => void;
}

export default function AIConversationPopup({ open, onClose, onGoalSelect }: AIConversationPopupProps) {
  const [message, setMessage] = useState("");

  const quickGoals = [
    { icon: "⚡", label: "Energy", value: "energy" },
    { icon: "🎯", label: "Focus", value: "focus" },
    { icon: "😴", label: "Sleep", value: "sleep" },
    { icon: "🛡️", label: "Immunity", value: "immunity" },
    { icon: "💪", label: "Fitness", value: "fitness" },
    { icon: "🧠", label: "Memory", value: "memory" },
  ];

  const handleGoalClick = (goal: string) => {
    console.log("Goal selected:", goal);
    onGoalSelect(goal);
    onClose();
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Custom message:", message);
      onGoalSelect(message);
      setMessage("");
      onClose();
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="bottom" className="h-[80vh]" data-testid="popup-ai-conversation">
        <SheetHeader className="mb-6">
          <SheetTitle className="flex items-center gap-3 text-xl">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                NutraScan AI
                <Sparkles className="w-4 h-4 text-primary" />
              </div>
              <div className="text-sm font-normal text-muted-foreground">
                Your supplement advisor
              </div>
            </div>
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-foreground">
              👋 Hi! I'm here to help you find the best supplements for your health goals. 
              What are you looking to improve today?
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold mb-3">Quick goals:</div>
            <div className="grid grid-cols-2 gap-2">
              {quickGoals.map((goal) => (
                <Button
                  key={goal.value}
                  variant="outline"
                  className="justify-start h-auto py-3"
                  onClick={() => handleGoalClick(goal.value)}
                  data-testid={`button-goal-${goal.value}`}
                >
                  <span className="text-xl mr-2">{goal.icon}</span>
                  <span>{goal.label}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">Or tell me your goal:</div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., I want to reduce anxiety naturally"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                data-testid="input-custom-goal"
              />
              <Button onClick={handleSendMessage} data-testid="button-send-goal">
                Send
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-border">
            <div className="text-xs text-muted-foreground text-center">
              Based on your goals, I'll recommend the most effective supplements 
              and help you avoid wasting money on ineffective products.
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
