
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";

const COOKIE_NAME = 'falseguard_cookie_consent';

export default function CookieConsentBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // This check needs to be in useEffect to run only on the client
    const consent = getCookie(COOKIE_NAME);
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const getCookie = (name: string): string | undefined => {
    if (typeof document === 'undefined') return undefined;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
        const part = parts.pop();
        if (part) {
            return part.split(';').shift();
        }
    }
    return undefined;
  };

  const acceptCookies = () => {
    setShowBanner(false);
    // Set cookie to expire in 1 year
    const date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    document.cookie = `${COOKIE_NAME}=true; expires=${date.toUTCString()}; path=/; SameSite=Lax; Secure`;
  };

  if (!showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-10 duration-500">
      <Card className="w-full max-w-4xl mx-auto shadow-2xl">
        <CardContent className="flex flex-col md:flex-row items-center justify-between gap-4 p-6">
          <p className="text-sm text-card-foreground">
            We use cookies to enhance your experience, analyze site traffic, and for personalizing ads. By clicking "Accept", you agree to our use of cookies.
          </p>
          <Button onClick={acceptCookies}>
            <Check className="mr-2 h-4 w-4" />
            Accept
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
