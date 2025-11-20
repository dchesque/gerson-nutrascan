import { useState, useRef } from "react";
import { Camera, FileText, Mic, Upload, Copy, X, AlertCircle, Loader2 } from "lucide-react";
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
  const [activeTab, setActiveTab] = useState<"photo" | "text" | "voice">("photo");
  const [textInput, setTextInput] = useState("");
  const [benefitsInput, setBenefitsInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isProcessingPhoto, setIsProcessingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const compressImage = (base64: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject(new Error('Failed to get canvas context'));

        const maxWidth = 1024;
        const maxHeight = 1024;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressed);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = base64;
    });
  };

  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingPhoto(true);
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64 = event.target?.result as string;
        try {
          const compressed = await compressImage(base64);
          setPhotoPreview(compressed);
          console.log("Photo captured, compressed and converted to base64");
          toast({
            title: "Photo Captured",
            description: "Click 'Analyze Photo' to process the supplement label",
          });
        } catch (compressError) {
          console.error("Error compressing photo:", compressError);
          setPhotoPreview(base64);
          toast({
            title: "Photo Captured",
            description: "Using original photo quality",
          });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error("Error processing photo:", error);
      toast({
        title: "Error",
        description: "Failed to process photo",
        variant: "destructive"
      });
    } finally {
      setIsProcessingPhoto(false);
    }
  };

  const handleAnalyzePhoto = () => {
    if (!photoPreview) {
      toast({
        title: "No Photo",
        description: "Please take or select a photo first",
        variant: "destructive"
      });
      return;
    }
    console.log("Photo analysis triggered");
    onAnalyze({ type: "photo", content: photoPreview });
  };

  const handleClearPhoto = () => {
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
          <TabsTrigger value="photo" data-testid="tab-photo" disabled={isLoading}>
            <Camera className="w-4 h-4 mr-2" />
            Photo
          </TabsTrigger>
          <TabsTrigger value="text" data-testid="tab-text" disabled={isLoading}>
            <FileText className="w-4 h-4 mr-2" />
            Text
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

            <div className="flex gap-2 pt-2">
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePhotoCapture}
            className="hidden"
            data-testid="input-photo-capture"
          />
          
          {photoPreview ? (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Captured supplement"
                  className="w-full rounded-lg border border-border object-contain max-h-[400px]"
                  data-testid="preview-photo"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAnalyzePhoto}
                  size="lg"
                  className="flex-1"
                  disabled={isLoading || isProcessingPhoto}
                  data-testid="button-analyze-photo"
                >
                  {isLoading || isProcessingPhoto ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5 mr-2" />
                      Analyze Photo
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleClearPhoto}
                  variant="outline"
                  size="lg"
                  disabled={isLoading || isProcessingPhoto}
                  data-testid="button-clear-photo"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-border rounded-lg bg-muted/30 p-6">
              <div className="rounded-full bg-primary/10 p-4 mb-4">
                <Camera className="w-12 h-12 text-primary" />
              </div>
              <p className="text-muted-foreground mb-2 text-center px-4 font-medium">
                Take a photo of the supplement label
              </p>
              <p className="text-muted-foreground mb-6 text-center px-4 text-sm">
                Point your camera at the supplement facts label for instant analysis
              </p>
              <Button
                onClick={() => fileInputRef.current?.click()}
                size="lg"
                disabled={isLoading || isProcessingPhoto}
                data-testid="button-upload-photo"
              >
                <Camera className="w-5 h-5 mr-2" />
                {isProcessingPhoto ? "Processing..." : "Take Photo"}
              </Button>
            </div>
          )}
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
