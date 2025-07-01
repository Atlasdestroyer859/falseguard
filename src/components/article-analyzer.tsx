
"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { classifyNewsArticle, ClassifyNewsArticleOutput } from "@/ai/flows/classify-news-article";
import { explainClassification, ExplainClassificationOutput } from "@/ai/flows/explain-classification";
import { provideEvidence, ProvideEvidenceOutput } from "@/ai/flows/provide-evidence";
import { answerGeneralQuestion } from "@/ai/flows/answer-general-question";
import { CheckCircle2, XCircle, Loader2, AlertTriangle, Bot } from "lucide-react";

interface AnalysisResult {
  classification: ClassifyNewsArticleOutput;
  explanation: ExplainClassificationOutput;
  counterResponse?: ProvideEvidenceOutput;
}

export default function ArticleAnalyzer() {
  const [articleContent, setArticleContent] = useState<string>("");
  const [articleUrl, setArticleUrl] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [generalAnswer, setGeneralAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!articleContent.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some article content or a question to analyze.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    setGeneralAnswer(null);

    try {
      const classificationResult = await classifyNewsArticle({ articleContent });
      
      if (classificationResult.classification === 'Question') {
        const answerResult = await answerGeneralQuestion({ question: articleContent });
        setGeneralAnswer(answerResult.answer);
      } else {
        const explanationResult = await explainClassification({
          articleContent,
          classification: classificationResult.classification,
        });

        let counterResponseResult: ProvideEvidenceOutput | undefined = undefined;
        counterResponseResult = await provideEvidence({
          article: articleContent,
          classification: classificationResult.classification,
          articleUrl: articleUrl.trim() || undefined,
        });
        
        setAnalysisResult({
          classification: classificationResult,
          explanation: explanationResult,
          counterResponse: counterResponseResult,
        });
      }

    } catch (err) {
      console.error("Analysis error:", err);
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
        <CardTitle className="text-2xl">News Article Veracity Check</CardTitle>
        <CardDescription>
          Paste the content of a news article, or ask a question, to get an AI-powered analysis.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <Label htmlFor="articleContent">Article Content or Question</Label>
            <Textarea
              id="articleContent"
              placeholder="Paste your news article content here, or ask a question..."
              value={articleContent}
              onChange={(e) => setArticleContent(e.target.value)}
              rows={8}
              className="focus:ring-primary focus:border-primary"
              disabled={isLoading}
            />
          </div>
           <div className="space-y-1">
            <Label htmlFor="articleUrl">Article URL (Optional, for article analysis)</Label>
            <Input
              id="articleUrl"
              type="url"
              placeholder="https://example.com/news-article"
              value={articleUrl}
              onChange={(e) => setArticleUrl(e.target.value)}
              className="focus:ring-primary focus:border-primary"
              disabled={isLoading}
            />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze"
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

        {generalAnswer && !error && (
          <Card className="mt-6 shadow-md">
            <CardHeader>
              <CardTitle className="text-xl text-primary flex items-center">
                <Bot className="mr-2 h-6 w-6" />
                AI Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-sm text-foreground bg-secondary p-3 rounded-md">
                {generalAnswer}
              </p>
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
                  {analysisResult.classification.classification === "Real" ? (
                    <CheckCircle2 className="mr-2 h-6 w-6 text-accent" />
                  ) : (
                    <XCircle className="mr-2 h-6 w-6 text-destructive" />
                  )}
                  Classification: {analysisResult.classification.classification}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Confidence: {(analysisResult.classification.confidence * 100).toFixed(0)}%
                </p>
                <Progress value={analysisResult.classification.confidence * 100} className="mt-1 h-2 [&>div]:bg-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Reasoning</h3>
                <p className="text-sm text-foreground bg-secondary p-3 rounded-md">
                  {analysisResult.explanation.explanation}
                </p>
                 <p className="text-xs text-muted-foreground mt-1">
                  Explanation Confidence: {(analysisResult.explanation.confidenceScore * 100).toFixed(0)}%
                </p>
              </div>
              
              {analysisResult.counterResponse && (
                <div>
                  <h3 className="text-lg font-semibold mb-1 flex items-center">
                    <Bot className="mr-2 h-6 w-6 text-primary"/>
                    AI Counter-Response
                  </h3>
                  <p className="text-sm text-foreground bg-secondary p-3 rounded-md whitespace-pre-wrap">
                    {analysisResult.counterResponse.counterResponse}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Response Confidence: {(analysisResult.counterResponse.confidenceScore * 100).toFixed(0)}%
                  </p>

                  {analysisResult.counterResponse.supportingLinks && analysisResult.counterResponse.supportingLinks.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-md font-semibold mb-2">Supporting Sources:</h4>
                      <ul className="list-disc list-inside space-y-2 pl-2">
                        {analysisResult.counterResponse.supportingLinks.map((link, index) => (
                          <li key={index} className="text-sm">
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                              {link.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
}
