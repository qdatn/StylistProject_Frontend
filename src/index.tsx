import { createRoot } from "react-dom/client";
import App from "./app";
import { Provider } from "react-redux";
import store from "@redux/store"; // Đường dẫn đến file store
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import { persistor } from "@redux/store";
import { PersistGate } from "redux-persist/integration/react";
const appElement = document.getElementById("root");
const queryClient = new QueryClient();

if (appElement) {
  const root = createRoot(appElement);
  root.render(
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <App />
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </React.StrictMode>
  );
} else {
  console.error("App root element not found");
}
