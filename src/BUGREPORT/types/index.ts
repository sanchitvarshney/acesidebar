export interface ErrorReport {
  reqId: string;
  errorId: string;
  timestamp: string;
}

export interface ErrorResponse {
  type: string;
  message: string;
  success: boolean;
  report: ErrorReport;
}

export interface BugReportPayload {
  feedback: string;
  errorDetails: {
    message: string;
    report: ErrorReport;
    originalError: any;
    userAgent: string;
    url: string;
    timestamp: string;
  };
  preferences: {
    emailOptIn: boolean;
  };
}

export interface InternalErrorDialogueProps {
  open: boolean;
  onClose: () => void;
  onTryAgain: () => void;
  onContactCustomerCare: () => void;
  message: string;
  report: ErrorReport;
}

export interface CustomerCareDrawerProps {
  open: boolean;
  onClose: () => void;
  errorMessage: string;
  errorReport: ErrorReport;
  originalError?: any;
}

export interface ErrorContextType {
  showInternalError: (message: string, report: ErrorReport, originalError?: any) => void;
  hideInternalError: () => void;
  showCustomerCareDrawer: () => void;
  hideCustomerCareDrawer: () => void;
}
