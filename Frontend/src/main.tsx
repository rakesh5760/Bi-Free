import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./styles/index.css";

  async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return;
  }
  const { worker } = await import('./mocks/browser');
  return worker.start({
    onUnhandledRequest: 'bypass', // Don't warn on unhandled requests (like static assets)
  });
}

enableMocking().then(() => {
  createRoot(document.getElementById("root")!).render(<App />);
});
  