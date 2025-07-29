"use client";

import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Note: This app requires the NEXT_PUBLIC_GOOGLE_CLIENT_ID environment variable to be set.
// You can create a `.env.local` file in the root of your project:
// NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "449319519590-dak94in0o75is1mu9jhqa0ei9b0oojh4.apps.googleusercontent.com";

export function Providers({ children }: { children: React.ReactNode }) {
    if (!GOOGLE_CLIENT_ID) {
        return (
            <div className="flex items-center justify-center min-h-screen text-white bg-red-900 p-4">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-2">Configuration Error</h1>
                    <p>
                        Google Client ID is missing. Please set the 
                        <code className="bg-red-800 p-1 rounded-md mx-1">NEXT_PUBLIC_GOOGLE_CLIENT_ID</code> environment variable.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            {children}
        </GoogleOAuthProvider>
    );
}
