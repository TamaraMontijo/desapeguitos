declare module '@env' {
  export const EXPO_PUBLIC_ANDROID_CLIENT_ID: string;
  export const EXPO_PUBLIC_IOS_CLIENT_ID: string;
  export const EXPO_PUBLIC_WEB_CLIENT_ID: string;
  export const EXPO_PUBLIC_FIREBASE_CONFIG: {
    apiKey: string,
    authDomain: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string,
    measurementId: string
  }
}