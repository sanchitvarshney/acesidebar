import { createContext, useEffect, useState, type ReactNode } from "react";
import ToastShow from "../components/common/ToastShow";

type ToastType = "success" | "error" | "warning";
type ToastErrorType = "borderToast" | "boxToast";

export interface ToastContextProps {
  showToast: (msg: string, type?: ToastType, typeError?: ToastErrorType, animate?: boolean) => void 
}

export const ToastCreateContext = createContext<ToastContextProps | undefined>(
  undefined
);

export const ToastContext = ({ children }: { children: ReactNode }) => {
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("success");
  const [toastErrType, setToastErrType] = useState<ToastErrorType>("borderToast");
  const [animate, setAnimate] = useState<boolean | any>(true);

  const showToast = (
    msg: string,
    type: ToastType = "success",
    typeError?: any,
    animate?: boolean
  ) => {
    setToastMessage(msg);
    setToastType(type);
    setToastOpen(true);
    setToastErrType(typeError);
    setAnimate(animate);
  };

  const handleToastClose = () => {
    setToastOpen(false);
  };

  return (
    <ToastCreateContext.Provider value={{ showToast }}>
      {children}
      <ToastShow
        isOpen={toastOpen}
        msg={toastMessage}
        type={toastType}
        typeError={toastErrType}
        animate={animate}
        onClose={handleToastClose}
      />
    </ToastCreateContext.Provider>
  );
};
