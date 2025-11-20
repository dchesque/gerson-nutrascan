// Stripe subscription page - blueprint:javascript_stripe
import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const SubscribeForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/subscription-success`,
      },
    });

    setIsProcessing(false);

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "You are now subscribed to premium!",
      });
      setLocation('/');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={!stripe || isProcessing}
        data-testid="button-submit-payment"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          "Subscribe for $9.99/month"
        )}
      </Button>
    </form>
  );
};

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [, setLocation] = useLocation();

  useEffect(() => {
    apiRequest("POST", "/api/create-subscription", {})
      .then((res) => res.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret);
        }
      })
      .catch((error) => {
        console.error("Subscription error:", error);
      });
  }, []);

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Setting up your subscription...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="p-6 mb-6">
          <h1 className="text-2xl font-bold font-heading mb-2">NutraScan AI Premium</h1>
          <p className="text-muted-foreground mb-6">
            Unlock unlimited supplement analyses and save hundreds on your purchases
          </p>
          
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">Unlimited supplement analyses</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">AI-powered ingredient breakdown</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">Real-time alternative recommendations</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <span className="text-sm">GPS-based local store comparisons</span>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <SubscribeForm />
          </Elements>
        </Card>

        <div className="text-center mt-4">
          <Button variant="ghost" onClick={() => setLocation('/')}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
