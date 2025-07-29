"use client";

import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import type { User } from '@/types';
import { SparklesIcon } from '@/constants';

interface WelcomeScreenProps {
  onLoginSuccess: (user: User) => void;
  onStartAsGuest: () => void;
}

interface GoogleJwtPayload {
  email: string;
  name: string;
  picture: string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onLoginSuccess, onStartAsGuest }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-brand-background">
      <div className="max-w-2xl">
        <SparklesIcon className="w-16 h-16 mx-auto text-brand-primary" />
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-brand-text-primary sm:text-5xl">
          AI-Powered LinkedIn Strategy Architect
        </h1>
        <p className="mt-6 text-lg leading-8 text-brand-text-secondary">
          Generate a personalized content strategy, schedule posts, and get AI assistance to elevate your professional presence. All data is saved securely in your browser.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
           <GoogleLogin
            onSuccess={credentialResponse => {
                if (credentialResponse.credential) {
                    try {
                        const decoded: GoogleJwtPayload = jwtDecode(credentialResponse.credential);
                        const user: User = {
                            email: decoded.email,
                            name: decoded.name,
                            picture: decoded.picture
                        };
                        onLoginSuccess(user);
                    } catch (error) {
                        console.error("Error decoding JWT:", error);
                        alert('There was an error processing your login. Please try again.');
                    }
                }
            }}
            onError={() => {
                console.log('Login Failed');
                alert('Google login failed. Please try again.');
            }}
            theme="filled_black"
            text="continue_with"
            shape="pill"
            size="large"
          />
          <span className="text-brand-text-secondary">or</span>
          <button
            onClick={onStartAsGuest}
            className="rounded-full bg-brand-secondary hover:bg-brand-secondary-hover px-6 py-3 text-md font-semibold text-brand-text-primary shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary transition-colors w-full sm:w-auto"
          >
            Continue as Guest
          </button>
        </div>
      </div>
    </div>
  );
};