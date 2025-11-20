import { useState } from "react";
import { Camera, FileText, Mic, Upload, Copy, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

interface ScanInterfaceProps {
  onAnalyze: (data: { type: "photo" | "text" | "voice"; content: string }) => void;
  isLoading?: boolean;
}

const EXAMPLE_TEXT = "Vitamin D3 5000 IU, Vitamin C 1000mg, Zinc 25mg, Magnesium 400mg, Calcium 800mg";

export default function ScanInterface({ onAnalyze, isLoading = false }: ScanInterfaceProps) {
  const [activeTab, setActiveTab] = useState<"photo" | "text" | "voice">("text");
  const [textInput, setTextInput] = useState("");
  const [benefitsInput, setBenefitsInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();

  const handlePhotoUpload = () => {
    console.log("Photo upload triggered");
    const text = prompt("Enter supplement label text (photo upload coming soon):");
    if (text?.trim()) {
      onAnalyze({ type: "text", content: text });
    }
  };

  const handleTextAnalyze = () => {
    if (!textInput.trim()) {
      toast({
        title: "Empty Input",
        description: "Please enter supplement ingredients to analyze",
        variant: "destructive"
      });
      return;
    }
    
    if (textInput.length < 5) {
      toast({
        title: "Input Too Short",
        description: "Please provide more details about the supplement",
        variant: "destructive"
      });
      return;
    }

    console.log("Text analysis triggered:", textInput, "Benefits:", benefitsInput);
    const content = benefitsInput.trim() ? `${textInput}\n\nBenefits: ${benefitsInput}` : textInput;
    onAnalyze({ type: "text", content });
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    console.log(isRecording ? "Recording stopped" : "Recording started");
    if (isRecording) {
      const text = prompt("Enter supplement description (voice input coming soon):");
      if (text?.trim()) {
        onAnalyze({ type: "text", content: text });
      }
    }
  };

  const handleCopyExample = () => {
    setTextInput(EXAMPLE_TEXT);
    toast({
      title: "Example Loaded",
      description: "Paste your supplement ingredients here",
    });
  };

  const handleClear = () => {
    setTextInput("");
  };

  const charCount = textInput.length;
  const charLimit = 1000;

  return (
    <Card className="p-6" data-testid="scan-interface">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="text" data-testid="tab-text" disabled={isLoading}>
            <FileText className="w-4 h-4 mr-2" />
            Text
          </TabsTrigger>
          <TabsTrigger value="photo" data-testid="tab-photo" disabled={isLoading}>
            <Camera className="w-4 h-4 mr-2" />
            Photo
          </TabsTrigger>
          <TabsTrigger value="voice" data-testid="tab-voice" disabled={isLoading}>
            <Mic className="w-4 h-4 mr-2" />
            Voice
          </TabsTrigger>
        </TabsList>

        {/* Text Tab */}
        <TabsContent value="text" className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium">Supplement Ingredients</label>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${charCount > charLimit * 0.9 ? "text-destructive" : "text-muted-foreground"}`}>
                  {charCount}/{charLimit}
                </span>
              </div>
            </div>
            
            <Textarea
              placeholder="Type or paste the supplement ingredients and dosages..."
              value={textInput}
              onChange={(e) => setTextInput(e.target.value.slice(0, charLimit))}
              className="min-h-[200px] text-base"
              data-testid="input-text-supplement"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">What will this supplement help with?</label>
            <Textarea
              placeholder="e.g., Immune support, Energy, Better sleep, Joint health..."
              value={benefitsInput}
              onChange={(e) => setBenefitsInput(e.target.value)}
              className="min-h-[80px] text-base"
              data-testid="input-benefits"
              disabled={isLoading}
            />
            <p className="text-xs text-muted-foreground">This helps us give better recommendations and track what's working for you</p>
          </div>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopyExample}
                disabled={isLoading}
                data-testid="button-load-example"
              >
                <Copy className="w-4 h-4 mr-1" />
                Load Example
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClear}
                disabled={isLoading || !textInput}
                data-testid="button-clear-text"
              >
                <X className="w-4 h-4 mr-1" />
                Clear
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              Example: "Vitamin D3 5000 IU, Vitamin C 1000mg, Zinc 25mg"
            </p>
          </div>

          <Button
            onClick={handleTextAnalyze}
            className="w-full"
            size="lg"
            disabled={!textInput.trim() || isLoading}
            data-testid="button-analyze-text"
          >
            {isLoading ? "Analyzing..." : "Analyze Supplement"}
          </Button>
        </TabsContent>

        {/* Photo Tab */}
        <TabsContent value="photo" className="space-y-4">
          <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-border rounded-lg bg-muted/30 p-6">
            <Upload className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4 text-center px-4 font-medium">
              Take a photo of the supplement label
            </p>
            <p className="text-muted-foreground mb-6 text-center px-4 text-sm">
              Coming soon: Full OCR support. For now, type the ingredients instead.
            </p>
            <Button
              onClick={handlePhotoUpload}
              size="lg"
              disabled={isLoading}
              data-testid="button-upload-photo"
            >
              <Camera className="w-5 h-5 mr-2" />
              Upload Photo
            </Button>
          </div>
        </TabsContent>

        {/* Voice Tab */}
        <TabsContent value="voice" className="space-y-4">
          <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-border rounded-lg bg-muted/30 p-6">
            <div className={`rounded-full p-8 mb-4 transition-all ${isRecording ? "bg-destructive/10 animate-pulse" : "bg-primary/10"}`}>
              <Mic className={`w-16 h-16 transition-colors ${isRecording ? "text-destructive" : "text-primary"}`} />
            </div>
            <p className="text-muted-foreground mb-2 text-center px-4 font-medium">
              {isRecording ? "Listening... Speak the ingredients" : "Speak the supplement ingredients"}
            </p>
            <p className="text-muted-foreground mb-6 text-center px-4 text-sm">
              Coming soon: Full voice transcription. For now, type the ingredients instead.
            </p>
            <Button
              onClick={handleVoiceRecord}
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              disabled={isLoading}
              data-testid="button-voice-record"
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>

      {/* Info Box */}
      <div className="mt-6 p-4 bg-primary/5 border border-primary/10 rounded-lg flex gap-3">
        <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-foreground mb-1">Pro Tip:</p>
          <p className="text-muted-foreground">Enter the complete ingredient list with dosages for the most accurate analysis. Include the serving size if available.</p>
        </div>
      </div>
    </Card>
  );
}
