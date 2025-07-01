"use client";

import { useState, ChangeEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { analyzePdfPhoto, AnalyzePdfPhotoOutput } from "@/ai/flows/analyze-pdf-photo";
import { CheckCircle2, XCircle, Loader2, AlertTriangle, UploadCloud, FileText } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const fileToDataUri = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      resolve(reader.result as string);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function MediaAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [userQuery, setUserQuery] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<AnalyzePdfPhotoOutput | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File Too Large",
          description: "Please select a file smaller than 5MB.",
          variant: "destructive",
        });
        setFile(null);
        setFilePreview(null);
        return;
      }
      setFile(selectedFile);
      setAnalysisResult(null);
      setError(null);

      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else if (selectedFile.type === "application/pdf") {
        setFilePreview("pdf"); // Special value for PDF preview
      } else {
        setFilePreview(null);
      }
    } else {
      setFile(null);
      setFilePreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      toast({
        title: "No File Selected",
        description: "Please select a PDF or image file to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const fileDataUri = await fileToDataUri(file);
      const result = await analyzePdfPhoto({
        fileDataUri,
        userQuery: userQuery.trim() || undefined,
      });
      setAnalysisResult(result);
    } catch (err) {
      console.error("Media analysis error:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during analysis.";
      setError(errorMessage);
      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">PDF/Image Authenticity Check</CardTitle>
        <CardDescription>
          Upload a file and ask a question, or let the AI perform a general authenticity check. Max file size: 5MB.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
             <label htmlFor="file-upload" className="sr-only">Choose file</label>
            <Input
              id="file-upload"
              type="file"
              accept="application/pdf,image/*"
              onChange={handleFileChange}
              className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 focus:ring-primary focus:border-primary"
              disabled={isLoading}
            />
            {filePreview && (
              <div className="mt-4 p-4 border rounded-md bg-secondary flex flex-col items-center">
                {filePreview === "pdf" ? (
                  <div className="text-center">
                    <FileText className="h-16 w-16 mx-auto text-primary" />
                    <p className="mt-2 text-sm font-medium">{file?.name}</p>
                    <p className="text-xs text-muted-foreground">PDF Document</p>
                  </div>
                ) : (
                  <Image src={filePreview} alt="File preview" width={200} height={200} className="rounded-md object-contain max-h-[200px]" data-ai-hint="document preview" />
                )}
              </div>
            )}
            {!filePreview && file && ( // Fallback for non-image/pdf previews if any
                <div className="mt-4 p-4 border rounded-md bg-secondary text-center">
                    <UploadCloud className="h-16 w-16 mx-auto text-primary" />
                    <p className="mt-2 text-sm font-medium">{file?.name}</p>
                </div>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="userQuery">Specific Question (Optional)</Label>
            <Textarea
              id="userQuery"
              placeholder="e.g., 'Is the logo in this image authentic?' or 'Summarize the key points of this document.'"
              value={userQuery}
              onChange={(e) => setUserQuery(e.target.value)}
              rows={3}
              className="focus:ring-primary focus:border-primary"
              disabled={isLoading || !file}
            />
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading || !file}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing Media...
              </>
            ) : (
              "Analyze Media"
            )}
          </Button>
        </form>

        {error && (
           <Card className="mt-6 border-destructive bg-destructive/10">
            <CardHeader>
              <CardTitle className="flex items-center text-destructive">
                <AlertTriangle className="mr-2 h-5 w-5" />
                Analysis Error
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-destructive-foreground">{error}</p>
            </CardContent>
          </Card>
        )}

        {analysisResult && !error && (
          <Card className="mt-6 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-primary">Analysis Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-1 flex items-center">
                  {analysisResult.isFakeNews ? (
                    <XCircle className="mr-2 h-6 w-6 text-destructive" />
                  ) : (
                    <CheckCircle2 className="mr-2 h-6 w-6 text-accent" />
                  )}
                  Assessment: {analysisResult.isFakeNews ? "Potential Misleading Content Found" : "Content Appears Authentic"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Confidence: {(analysisResult.confidenceScore * 100).toFixed(0)}%
                </p>
                <Progress value={analysisResult.confidenceScore * 100} className="mt-1 h-2 [&>div]:bg-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">AI Response</h3>
                <p className="text-sm text-foreground bg-secondary p-3 rounded-md">
                  {analysisResult.reasoning}
                </p>
              </div>
              {analysisResult.evidence && (
                <div>
                  <h3 className="text-lg font-semibold mb-1">Supporting Evidence</h3>
                  <p className="text-sm text-foreground bg-secondary p-3 rounded-md">
                    {analysisResult.evidence}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
