import { ErrorResponse } from '../types';


export const handleInternalError = (errorData: ErrorResponse, originalError?: any): void => {
  if (errorData.type === 'INTERNAL_ERROR') {
    const errorEvent = new CustomEvent('internalError', {
      detail: {
        message: errorData.message,
        report: errorData.report,
        originalError: originalError || errorData,
      },
    });
    window.dispatchEvent(errorEvent);
  }
};



export const isInternalError = (errorData: any): errorData is ErrorResponse => {
  return errorData && 
         errorData.type === 'INTERNAL_ERROR' && 
         errorData.message && 
         errorData.report;
};


export const extractErrorData = (response: any): ErrorResponse | null => {
  if (response?.data && isInternalError(response.data)) {
    return response.data;
  }
  return null;
};
