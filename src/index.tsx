import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Tasks } from "./screens/Tasks";
import { ThemeProvider } from "./contexts/ThemeContext";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <ThemeProvider>
      <Tasks />
    </ThemeProvider>
  </StrictMode>,
);
