import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Tasks } from "./screens/Tasks";

createRoot(document.getElementById("app") as HTMLElement).render(
  <StrictMode>
    <Tasks />
  </StrictMode>,
);
