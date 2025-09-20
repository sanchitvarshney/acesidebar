// Simple toast utility for use outside React components
let globalToastFunction: ((msg: string, type?: "success" | "error" | "warning", typeError?: "borderToast" | "boxToast", animate?: boolean) => void) | null = null;

export const setGlobalToast = (toastFn: (msg: string, type?: "success" | "error" | "warning", typeError?: "borderToast" | "boxToast", animate?: boolean) => void) => {
  globalToastFunction = toastFn;
};

export const showToast = (msg: string, type?: "success" | "error" | "warning", typeError?: "borderToast" | "boxToast", animate?: boolean) => {
  if (globalToastFunction) {
    globalToastFunction(msg, type, typeError, animate);
  } else {
    console.warn("Global toast function not set. Toast message:", msg);
  }
};
