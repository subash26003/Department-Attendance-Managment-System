import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import StudentDataProvider from "./context/StudentDataContext.jsx";
import { BrowserRouter } from "react-router";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <StudentDataProvider>
        <App />
      </StudentDataProvider>
    </BrowserRouter>
  </StrictMode>
);
