
import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { ConsoleSpanExporter, SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';

// Setup tracing for the browser
// Ensure this code only runs in the browser
if (typeof window !== 'undefined') {
  const provider = new WebTracerProvider();
  provider.addSpanProcessor(new SimpleSpanProcessor(new ConsoleSpanExporter()));
  provider.register();
  console.log("OpenTelemetry WebTracerProvider registered for client-side.");
}
