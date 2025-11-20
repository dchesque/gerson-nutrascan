import { useState } from "react";
import { Camera, FileText, Mic, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ScanInterfaceProps {
  onAnalyze: (data: { type: "photo" | "text" | "voice"; content: string }) => void;
}

export default function ScanInterface({ onAnalyze }: ScanInterfaceProps) {
  const [activeTab, setActiveTab] = useState<"photo" | "text" | "voice">("photo");
  const [textInput, setTextInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);

  const handlePhotoUpload = () => {
    console.log("Photo upload triggered");
    // TODO: Implement actual photo upload and OCR
    const text = prompt("Enter supplement label text (photo upload coming soon):");
    if (text) {
      onAnalyze({ type: "text", content: text });
    }
  };

  const handleTextAnalyze = () => {
    if (textInput.trim()) {
      console.log("Text analysis triggered:", textInput);
      onAnalyze({ type: "text", content: textInput });
    }
  };

  const handleVoiceRecord = () => {
    setIsRecording(!isRecording);
    console.log(isRecording ? "Recording stopped" : "Recording started");
    if (isRecording) {
      // TODO: Implement actual voice recording and transcription
      const text = prompt("Enter supplement description (voice input coming soon):");
      if (text) {
        onAnalyze({ type: "text", content: text });
      }
    }
  };

  return (
    <Card className="p-6" data-testid="scan-interface">
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="photo" data-testid="tab-photo">
            <Camera className="w-4 h-4 mr-2" />
            Photo
          </TabsTrigger>
          <TabsTrigger value="text" data-testid="tab-text">
            <FileText className="w-4 h-4 mr-2" />
            Text
          </TabsTrigger>
          <TabsTrigger value="voice" data-testid="tab-voice">
            <Mic className="w-4 h-4 mr-2" />
            Voice
          </TabsTrigger>
        </TabsList>

        <TabsContent value="photo" className="space-y-4">
          <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-border rounded-lg bg-muted/30">
            <Upload className="w-16 h-16 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4 text-center px-4">
              Take a photo of the supplement label or upload from gallery
            </p>
            <Button onClick={handlePhotoUpload} size="lg" data-testid="button-upload-photo">
              <Camera className="w-5 h-5 mr-2" />
              Upload Photo
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="text" className="space-y-4">
          <Textarea
            placeholder="Type or paste the supplement ingredients here...&#10;Example: Vitamin D3 5000 IU, Vitamin C 1000mg, Zinc 25mg"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            className="min-h-[200px] text-base"
            data-testid="input-text-supplement"
          />
          <Button onClick={handleTextAnalyze} className="w-full" size="lg" data-testid="button-analyze-text">
            Analyze Supplement
          </Button>
        </TabsContent>

        <TabsContent value="voice" className="space-y-4">
          <div className="flex flex-col items-center justify-center min-h-[300px] border-2 border-dashed border-border rounded-lg bg-muted/30">
            <div className={`rounded-full p-8 mb-4 ${isRecording ? "bg-destructive/10 animate-pulse" : "bg-primary/10"}`}>
              <Mic className={`w-16 h-16 ${isRecording ? "text-destructive" : "text-primary"}`} />
            </div>
            <p className="text-muted-foreground mb-4 text-center px-4">
              {isRecording ? "Listening... Speak the ingredients" : "Tap to start recording ingredients"}
            </p>
            <Button
              onClick={handleVoiceRecord}
              variant={isRecording ? "destructive" : "default"}
              size="lg"
              data-testid="button-voice-record"
            >
              {isRecording ? "Stop Recording" : "Start Recording"}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
