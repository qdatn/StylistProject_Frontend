import { createRoot } from "react-dom/client";
import App from "./app";

const appElement = document.getElementById("root");

if (appElement) {
  const root = createRoot(appElement);
  // root.render(<h1>Hello, world</h1>);
  root.render(<App />);
} else {
  console.error("App root element not found");
}
