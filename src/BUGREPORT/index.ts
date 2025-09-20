// Context
export { ErrorProvider, useErrorContext } from './context/ErrorContext';

// Components
export { default as InternalErrorDialogue } from './components/InternalErrorDialogue';
export { default as CustomerCareDrawer } from './components/CustomerCareDrawer';

// Services
export { handleInternalError, isInternalError, extractErrorData } from './services/errorHandler';
export { submitErrorReport } from './services/submitErrorReport';

// Types
export type {
  ErrorReport,
  ErrorResponse,
  BugReportPayload,
  InternalErrorDialogueProps,
  CustomerCareDrawerProps,
  ErrorContextType
} from './types';

