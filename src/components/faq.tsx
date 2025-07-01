
"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const faqData = [
  {
    question: "How does FalseGuard work?",
    answer: "FalseGuard uses an advanced AI based on a CNN model to analyze the content you provide. For articles, it cross-references claims with live search results from the Tavily API to find supporting or conflicting evidence. For images and PDFs, it analyzes the content for indicators of manipulation or misinformation.",
  },
  {
    question: "Is the analysis 100% accurate?",
    answer: "While our AI is highly advanced, no system is perfect. The analysis provides a confidence score to indicate how certain the AI is. We strongly recommend using FalseGuard as a powerful guide, but always supplement it with your own critical judgment and by reviewing the supporting links provided.",
  },
  {
    question: "Why are there ads on this website?",
    answer: "Running the AI models and the web search APIs that power FalseGuard incurs costs. Ads help us cover these operational expenses and allow us to offer this service for free to users. We strive to keep ads as unobtrusive as possible.",
  },
  {
    question: "Can I use FalseGuard for any language?",
    answer: "The underlying AI models have multilingual capabilities, but they perform best with English language content. You may get good results with other languages, but accuracy might vary.",
  },
  {
    question: "What happens to the data I submit?",
    answer: "We are committed to user privacy. The content you submit is sent to the AI for analysis but is not stored or used for any other purpose. It is processed in memory and then discarded. Please review our cookie policy for more details on data handling.",
  },
];

export default function Faq() {
  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Frequently Asked Questions</CardTitle>
        <CardDescription>
            Find answers to common questions about FalseGuard.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {faqData.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index}>
              <AccordionTrigger className="text-left font-semibold">{item.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
