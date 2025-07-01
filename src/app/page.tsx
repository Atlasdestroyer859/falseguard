
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ArticleAnalyzer from "@/components/article-analyzer";
import MediaAnalyzer from "@/components/media-analyzer";
import { FileText, Image as ImageIcon, HelpCircle } from "lucide-react"; // Renamed Image to ImageIcon to avoid conflict
import { DarkModeToggle } from "@/components/dark-mode-toggle";
import AdPlaceholder from "@/components/ad-placeholder";
import FeedbackDialog from "@/components/feedback-dialog";
import Faq from "@/components/faq";

export default function Home() {
  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col min-h-screen bg-background p-4 md:p-8">
      <header className="w-full mb-8 relative">
        <div className="text-center">
            <h1 className="text-4xl font-bold text-primary">FalseGuard</h1>
            <p className="text-muted-foreground mt-2">
              Your AI-powered tool for detecting and understanding potentially misleading information.
            </p>
        </div>
        <div className="absolute top-0 right-0">
          <DarkModeToggle />
        </div>
      </header>

      <main className="w-full">
        <Tabs defaultValue="article" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="article">
              <FileText className="mr-2 h-5 w-5" />
              Article Analysis
            </TabsTrigger>
            <TabsTrigger value="media">
              <ImageIcon className="mr-2 h-5 w-5" />
              PDF/Image Analysis
            </TabsTrigger>
            <TabsTrigger value="faq">
                <HelpCircle className="mr-2 h-5 w-5" />
                FAQ
            </TabsTrigger>
          </TabsList>
          <TabsContent value="article">
            <ArticleAnalyzer />
          </TabsContent>
          <TabsContent value="media">
            <MediaAnalyzer />
          </TabsContent>
          <TabsContent value="faq">
            <Faq />
          </TabsContent>
        </Tabs>
      </main>

      <AdPlaceholder />

      <footer className="w-full mt-12 text-center text-sm text-muted-foreground">
        <div className="flex justify-center items-center gap-2">
          <p>&copy; {new Date().getFullYear()} FalseGuard. All rights reserved.</p>
          <span aria-hidden="true">&middot;</span>
          <FeedbackDialog />
        </div>
        <p className="mt-1">Made by Aditya Pathak</p>
      </footer>
    </div>
  );
}
