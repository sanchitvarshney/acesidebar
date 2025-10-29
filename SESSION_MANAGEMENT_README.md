# Session Management System

This document explains the session management system implemented for the login page with 1-minute session expiration.

## Overview

The session management system automatically generates a session ID when anyone visits the login page (`http://localhost:3000/login`) and tracks session expiration. If the session expires (after 1 minute of inactivity), users are redirected to a session expired page.

## Components

### 1. SessionManager (`src/utils/SessionManager.ts`)

A singleton utility class that handles all session-related operations:

**Key Features:**
- Generates unique session IDs
- Tracks session expiration (1 minute timeout)
- Stores session data in sessionStorage
- Provides session validation methods
- Automatic session checking every 10 seconds

**Main Methods:**
- `createSession()`: Creates a new session
- `isSessionValid()`: Checks if current session is valid
- `extendSession()`: Extends session expiration time
- `clearSession()`: Clears current session
- `getTimeRemaining()`: Gets time remaining until expiration

### 2. SessionExpiredPage (`src/pages/SessionExpiredPage.tsx`)

A dedicated page displayed when session expires:

**Features:**
- Clean, professional UI with company branding
- Clear messaging about session expiration
- Button to redirect to login page
- Automatic cleanup of session data

### 3. Updated LoginScreen (`src/USERMODULE/screens/LoginScreen.tsx`)

Modified to automatically create a session when the page loads:

**Changes:**
- Imports SessionManager
- Creates new session on component mount
- Logs session creation for debugging

### 4. Updated Protected Component (`src/components/protected/Protected.tsx`)

Enhanced to check session validity:

**New Logic:**
- Checks session validity for all routes
- Redirects to session expired page when session is invalid
- Handles both authenticated and non-authenticated routes

### 5. useSession Hook (`src/hooks/useSession.ts`)

A custom React hook for easy session management:

**Provides:**
- Real-time session state
- Session validity status
- Time remaining until expiration
- Session management methods

## How It Works

### 1. Session Creation
When someone visits `http://localhost:3000/login`:
1. LoginScreen component mounts
2. SessionManager creates a new session with unique ID
3. Session data is stored in sessionStorage
4. Session expiration timer starts (1 minute)

### 2. Session Monitoring
- SessionManager checks session validity every 10 seconds
- If session expires, automatic redirect to `/session-expired`
- Session data includes creation time and expiration time

### 3. Session Expiration
When session expires:
1. User is redirected to `/session-expired` page
2. Session data is cleared from sessionStorage
3. User can click "Go to Login Page" to start fresh

### 4. Route Protection
All routes are protected by session validation:
- **Login page**: Requires valid session, redirects to expired page if invalid
- **Authenticated routes**: Require both authentication token and valid session
- **Session expired page**: Accessible without session validation

## Usage Examples

### Basic Session Management
```typescript
import { sessionManager } from '../utils/SessionManager';

// Create a new session
const session = sessionManager.createSession();

// Check if session is valid
const isValid = sessionManager.isSessionValid();

// Get time remaining
const timeRemaining = sessionManager.getTimeRemaining();
```

### Using the useSession Hook
```typescript
import { useSession } from '../hooks/useSession';

function MyComponent() {
  const {
    sessionData,
    isSessionValid,
    timeRemaining,
    timeRemainingFormatted,
    createSession,
    extendSession,
    clearSession
  } = useSession();

  return (
    <div>
      <p>Session Valid: {isSessionValid ? 'Yes' : 'No'}</p>
      <p>Time Remaining: {timeRemainingFormatted}</p>
    </div>
  );
}
```

## Configuration

### Session Duration
To change the session duration, modify the `SESSION_DURATION` constant in `SessionManager.ts`:

```typescript
private readonly SESSION_DURATION = 60 * 1000; // 1 minute in milliseconds
```

### Check Interval
To change how often the session is checked, modify the `CHECK_INTERVAL`:

```typescript
private readonly CHECK_INTERVAL = 10 * 1000; // Check every 10 seconds
```

## Testing

### Manual Testing
1. Visit `http://localhost:3000/login`
2. Wait for 1 minute without any activity
3. Try to navigate or refresh - should redirect to session expired page
4. Click "Go to Login Page" to start a new session

### Debug Information
The system logs session events to the console:
- Session creation
- Session expiration
- Session validation results

## Security Considerations

1. **Session Storage**: Sessions are stored in sessionStorage (cleared when browser tab closes)
2. **Automatic Cleanup**: Expired sessions are automatically cleared
3. **No Persistence**: Sessions don't persist across browser sessions
4. **Unique IDs**: Each session has a unique identifier

## Troubleshooting

### Common Issues

1. **Session not created**: Check browser console for errors
2. **Redirect loops**: Ensure session expired route is properly configured
3. **Session not expiring**: Check if SessionManager is running properly

### Debug Commands
```typescript
// Get session statistics
const stats = sessionManager.getSessionStats();
console.log(stats);

// Check current session
const session = sessionManager.getCurrentSession();
console.log(session);
```

## Future Enhancements

1. **Activity Detection**: Extend session on user activity
2. **Multiple Sessions**: Support for multiple concurrent sessions
3. **Session History**: Track session usage patterns
4. **Custom Timeouts**: Different timeouts for different user types
5. **Server-Side Validation**: Validate sessions with backend

## Files Modified/Created

- ✅ `src/pages/SessionExpiredPage.tsx` - New session expired page
- ✅ `src/utils/SessionManager.ts` - New session management utility
- ✅ `src/hooks/useSession.ts` - New session management hook
- ✅ `src/USERMODULE/screens/LoginScreen.tsx` - Updated to create sessions
- ✅ `src/components/protected/Protected.tsx` - Updated to check sessions
- ✅ `src/routes/Routing.tsx` - Added session expired route
