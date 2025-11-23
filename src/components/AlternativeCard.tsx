import { ExternalLink, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AlternativeCardProps {
  name: string;
  brand: string;
  score: number;
  price: number;
  currentPrice?: number;
  savings?: number;
  location?: string;
  distance?: string;
  url?: string;
  imageUrl?: string;
}

export default function AlternativeCard({
  name,
  brand,
  score,
  price,
  currentPrice,
  savings,
  location,
  distance,
  url,
  imageUrl,
}: AlternativeCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 71) return "bg-primary text-primary-foreground";
    if (score >= 41) return "bg-chart-4 text-white";
    return "bg-destructive text-destructive-foreground";
  };

  return (
    <Card className="overflow-hidden hover-elevate" data-testid={`alternative-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="relative">
        {imageUrl ? (
          <img src={imageUrl} alt={name} className="w-full h-40 object-cover bg-muted" />
        ) : (
          <div className="w-full h-40 bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
            <span className="text-muted-foreground text-sm">Product Image</span>
          </div>
        )}
        <Badge className={`absolute top-2 right-2 ${getScoreColor(score)}`} data-testid={`badge-score-${name.toLowerCase().replace(/\s+/g, '-')}`}>
          {score}/100
        </Badge>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <div className="text-xs text-muted-foreground mb-1">{brand}</div>
          <h4 className="font-semibold text-base leading-tight">{name}</h4>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold font-heading text-primary" data-testid={`price-${name.toLowerCase().replace(/\s+/g, '-')}`}>
            ${price.toFixed(2)}
          </span>
          {currentPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ${currentPrice.toFixed(2)}
            </span>
          )}
        </div>

        {savings && savings > 0 && (
          <div className="text-sm text-primary font-medium" data-testid={`savings-${name.toLowerCase().replace(/\s+/g, '-')}`}>
            💰 Save ${savings.toFixed(2)}
          </div>
        )}

        {distance && location && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>{distance} away • {location}</span>
          </div>
        )}

        <Button
          className="w-full"
          variant={url ? "default" : "secondary"}
          onClick={() => {
            if (url) {
              window.open(url, "_blank");
            }
            console.log("View product:", name);
          }}
          data-testid={`button-view-${name.toLowerCase().replace(/\s+/g, '-')}`}
        >
          {url ? (
            <>
              View Online
              <ExternalLink className="w-4 h-4 ml-2" />
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4 mr-2" />
              Available Nearby
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}
