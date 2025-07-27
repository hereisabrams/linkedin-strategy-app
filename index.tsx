import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { GoogleOAuthProvider } from '@react-oauth/google';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Use the provided Google Client ID to initialize the application
const GOOGLE_CLIENT_ID = "449319519590-dak94in0o75is1mu9jhqa0ei9b0oojh4.apps.googleusercontent.com";

const root = ReactDOM.createRoot(rootElement);

root.render(
    <React.StrictMode>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <App />
        </GoogleOAuthProvider>
    </React.StrictMode>
);
