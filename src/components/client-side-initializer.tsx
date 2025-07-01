
// src/components/client-side-initializer.tsx
'use client';

import '@/lib/otel-tracing'; // Import to execute the tracing setup
import type { ReactNode } from 'react';

// This component doesn't render anything itself but ensures
// the tracing setup is imported and run on the client side.
// It should wrap the main application content in the root layout.
export default function ClientSideInitializer({ children }: { children?: ReactNode }) {
  return <>{children}</>;
}
