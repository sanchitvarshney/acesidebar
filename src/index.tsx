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

// Clear console and show warning for developers
console.clear();
console.log(
  "%cSTOP!",
  "color:#fff;background:#b00020;padding:10px 20px;border-radius:10px;font-weight:900;font-size:56px"
);
console.log(
  "%cThis console is for developers.",
  "color:#b00020;font-weight:700;font-size:18px"
);
console.log(
  `%cIf someone told you to paste something here, it's a scam.
Pasting code here can give attackers access to your account.`,
  "color:#444;font-size:14px;line-height:1.5"
);

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

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
