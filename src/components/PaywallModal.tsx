import { CheckCircle2, X, Zap } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PaywallModalProps {
  open: boolean;
  onClose: () => void;
  onSubscribe: () => void;
}

export default function PaywallModal({ open, onClose, onSubscribe }: PaywallModalProps) {
  const benefits = [
    "Unlimited supplement analyses",
    "AI-powered ingredient breakdown",
    "Real-time alternative recommendations",
    "GPS-based local store comparisons",
    "Savings calculator & tracking",
    "Analysis history & favorites",
    "Priority customer support",
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md" data-testid="modal-paywall">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Upgrade to Premium
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">You've used your free analysis</div>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-4xl font-bold font-heading text-primary">$9.99</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <Badge variant="secondary" className="mt-2">
              Save hundreds on supplements
            </Badge>
          </div>

          <div className="space-y-3">
            <div className="text-sm font-semibold text-foreground mb-2">Premium Benefits:</div>
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Button
              className="w-full"
              size="lg"
              onClick={onSubscribe}
              data-testid="button-subscribe"
            >
              Start Premium Now
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={onClose}
              data-testid="button-close-paywall"
            >
              Maybe Later
            </Button>
          </div>

          <div className="text-center text-xs text-muted-foreground">
            Cancel anytime. No hidden fees.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
