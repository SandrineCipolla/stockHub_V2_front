import { Configuration, LogLevel } from '@azure/msal-browser';

// Policies Azure AD B2C
export const b2cPolicies = {
  names: {
    signUpSignIn: import.meta.env.VITE_SIGN_UP_SIGN_IN_POLICY,
    forgotPassword: import.meta.env.VITE_FORGOT_PASSWORD_POLICY,
    editProfile: import.meta.env.VITE_EDIT_PROFILE_POLICY,
  },
  authorities: {
    signUpSignIn: {
      authority: `https://${import.meta.env.VITE_AUTHORITY_DOMAIN}/${import.meta.env.VITE_TENANT_NAME}.onmicrosoft.com/${import.meta.env.VITE_SIGN_UP_SIGN_IN_POLICY}`,
    },
    forgotPassword: {
      authority: `https://${import.meta.env.VITE_AUTHORITY_DOMAIN}/${import.meta.env.VITE_TENANT_NAME}.onmicrosoft.com/${import.meta.env.VITE_FORGOT_PASSWORD_POLICY}`,
    },
    editProfile: {
      authority: `https://${import.meta.env.VITE_AUTHORITY_DOMAIN}/${import.meta.env.VITE_TENANT_NAME}.onmicrosoft.com/${import.meta.env.VITE_EDIT_PROFILE_POLICY}`,
    },
  },
  authorityDomain: import.meta.env.VITE_AUTHORITY_DOMAIN,
};

// Configuration MSAL
export const msalConfig: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_CLIENT_ID,
    authority: b2cPolicies.authorities.signUpSignIn.authority,
    knownAuthorities: [b2cPolicies.authorityDomain],
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(message);
            return;
          case LogLevel.Info:
            console.info(message);
            return;
          case LogLevel.Verbose:
            console.debug(message);
            return;
          case LogLevel.Warning:
            console.warn(message);
            return;
        }
      },
    },
  },
};

// Protected Resources
export const protectedResources = {
  stockHubApi: {
    endpoint: import.meta.env.VITE_API_SERVER_URL,
    scopes: {
      read: [import.meta.env.VITE_SCOPE_READ],
      write: [import.meta.env.VITE_SCOPE_WRITE],
    },
  },
};

// Login Request
export const loginRequest = {
  scopes: [
    ...protectedResources.stockHubApi.scopes.read,
    ...protectedResources.stockHubApi.scopes.write,
  ],
};
