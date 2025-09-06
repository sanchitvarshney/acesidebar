import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./font.css"
import "./App.css"
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ReplyContext from "./contextApi/ReplyContext";
import { Provider } from "react-redux";
import { store } from "./reduxStore/Store";
import theme from "./theme";
import { ThemeProvider } from "@mui/material";

setTimeout(console.log.bind(console, 
  "%cSTOP!%c\n\nThis console is for developers.\n%cIf someone told you to paste something here, it's a scam.\nPasting code here can give attackers access to your Ajaxter account.",
  "color:#fff;background:#b00020;padding:10px 20px;border-radius:10px;font-weight:900;font-size:56px",
  "color:#b00020;font-weight:700;font-size:18px",
  "color:#444;font-size:14px;line-height:1.5"
), 0);

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  // <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <ReplyContext>
          <App />
        </ReplyContext>
      </Provider>
    </ThemeProvider>
  // </React.StrictMode>
);

reportWebVitals();
