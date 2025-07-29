
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../types';
import { SparklesIcon } from '../constants';

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
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-background">
      <div className="max-w-3xl">
        <SparklesIcon className="w-16 h-16 mx-auto text-primary" />
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-text-primary sm:text-6xl">
          Build Your LinkedIn Presence, Powered by AI
        </h1>
        <p className="mt-6 text-lg leading-8 text-text-secondary">
          Stop guessing what to post. Generate a personalized LinkedIn strategy, content ideas, and a daily growth plan to help you stand out. Your data is saved in your browser.
        </p>
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6">
          <button
            onClick={onStartAsGuest}
            className="rounded-md bg-secondary px-6 py-3 text-lg font-semibold text-text-primary shadow-sm hover:bg-secondary-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary transition-colors w-full sm:w-auto"
          >
            Continue as Guest
          </button>
          <div className="text-text-tertiary text-sm">or</div>
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
            text="signin_with"
            shape="pill"
          />
        </div>
        <p className="text-xs text-text-tertiary mt-10">Sign in with Google to sync your strategy across devices.</p>
      </div>
    </div>
  );
};