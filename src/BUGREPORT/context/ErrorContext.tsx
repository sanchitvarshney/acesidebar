import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import InternalErrorDialogue from '../components/InternalErrorDialogue';
import CustomerCareDrawer from '../components/CustomerCareDrawer';
import { ErrorReport, ErrorContextType } from '../types';


const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

export const useErrorContext = () => {
  const context = useContext(ErrorContext);
  if (context === undefined) {
    throw new Error('useErrorContext must be used within an ErrorProvider');
  }
  return context;
};

interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider: React.FC<ErrorProviderProps> = ({ children }) => {
  const [isErrorDialogueOpen, setIsErrorDialogueOpen] = useState(false);
  const [isCustomerCareDrawerOpen, setIsCustomerCareDrawerOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [errorReport, setErrorReport] = useState<ErrorReport>({
    reqId: '',
    errorId: '',
    timestamp: '',
  });
  const [originalError, setOriginalError] = useState<any>(null);

  const showInternalError = (message: string, report: ErrorReport, originalErr?: any) => {
    setErrorMessage(message);
    setErrorReport(report);
    setOriginalError(originalErr);
    setIsErrorDialogueOpen(true);
  };

  const hideInternalError = () => {
    setIsErrorDialogueOpen(false);
    setErrorMessage('');
    setErrorReport({
      reqId: '',
      errorId: '',
      timestamp: '',
    });
    setOriginalError(null);
  };

  const showCustomerCareDrawer = () => {
    setIsCustomerCareDrawerOpen(true);
  };

  const hideCustomerCareDrawer = () => {
    setIsCustomerCareDrawerOpen(false);
    setErrorMessage('');
    setErrorReport({
      reqId: '',
      errorId: '',
      timestamp: '',
    });
    setOriginalError(null);
  };

  const handleTryAgain = () => {
    hideInternalError();
  };

  const handleContactCustomerCare = () => {
    setIsErrorDialogueOpen(false);
    setIsCustomerCareDrawerOpen(true);
  };

  // Listen for internal error events from the API service
  useEffect(() => {
    const handleInternalErrorEvent = (event: CustomEvent) => {
      const { message, report, originalError } = event.detail;
      showInternalError(message, report, originalError);
    };

    window.addEventListener('internalError', handleInternalErrorEvent as EventListener);

    return () => {
      window.removeEventListener('internalError', handleInternalErrorEvent as EventListener);
    };
  }, []);

  return (
    <ErrorContext.Provider value={{ 
      showInternalError, 
      hideInternalError, 
      showCustomerCareDrawer, 
      hideCustomerCareDrawer 
    }}>
      {children}
      <InternalErrorDialogue
        open={isErrorDialogueOpen}
        onClose={hideInternalError}
        onTryAgain={handleTryAgain}
        onContactCustomerCare={handleContactCustomerCare}
        message={errorMessage}
        report={errorReport}
      />
      <CustomerCareDrawer
        open={isCustomerCareDrawerOpen}
        onClose={hideCustomerCareDrawer}
        errorMessage={errorMessage}
        errorReport={errorReport}
        originalError={originalError}
      />
    </ErrorContext.Provider>
  );
};
