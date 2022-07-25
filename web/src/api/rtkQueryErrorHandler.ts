import { MiddlewareAPI, Middleware, isRejectedWithValue } from '@reduxjs/toolkit';

export const rtkQueryErrorLogger: Middleware = (api: MiddlewareAPI) => (next) => (action) => {
  if (!isRejectedWithValue(action)) {
    return next(action);
  }

  // ERROR: 401 (Unauthorized)
  // MSAL AccessToken or IdToken is no longer valid and the backend has rejected the request.
  // Perform a reload of the page to request new tokens from MSAL.
  if (action.payload?.originalStatus === 401 && action?.meta?.arg?.endpointName !== 'login') {
    return window.location.reload();
  }

  return next(action);
};
