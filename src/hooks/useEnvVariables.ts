
// Hook to check and report environment variables status

export const useEnvVariables = () => {
  const envVars = {
    FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
    OMDB_API_KEY: import.meta.env.VITE_OMDB_API_KEY,
    OPENROUTER_API_KEY: import.meta.env.VITE_OPENROUTER_API_KEY
  };
  
  const getStatus = () => {
    return Object.entries(envVars).map(([key, value]) => ({
      key,
      available: !!value,
      value: value ? `${value.substring(0, 3)}...${value.substring(value.length - 3)}` : undefined
    }));
  };
  
  const isFirebaseConfigComplete = () => {
    return (
      !!envVars.FIREBASE_API_KEY &&
      !!envVars.FIREBASE_AUTH_DOMAIN &&
      !!envVars.FIREBASE_PROJECT_ID
    );
  };
  
  return {
    envVars,
    getStatus,
    isFirebaseConfigComplete
  };
};
