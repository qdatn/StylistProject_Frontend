import { createRoot } from "react-dom/client";
import App from "./app";
import { Provider } from "react-redux";
import store from "@redux/store"; // Đường dẫn đến file store của bạn

const appElement = document.getElementById("root");

if (appElement) {
  const root = createRoot(appElement);
  root.render(
    <Provider store={store}>
      <App />
    </Provider>
  );
} else {
  console.error("App root element not found");
}
