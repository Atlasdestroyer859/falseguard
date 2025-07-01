"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

export default function AdPlaceholder() {
  return (
    <Card className="w-full mt-8 border-dashed">
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-normal text-muted-foreground text-center tracking-widest">
          ADVERTISEMENT
        </CardTitle>
      </CardHeader>
      <CardContent className="flex justify-center items-center">
        <a href="#" onClick={(e) => e.preventDefault()} aria-label="Advertisement">
            <Image
            src="https://placehold.co/728x90.png"
            width={728}
            height={90}
            alt="Ad Banner"
            className="rounded-md"
            data-ai-hint="advertisement banner"
            />
        </a>
      </CardContent>
    </Card>
  );
}
