
import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import type { User } from '../types';
import { SparklesIcon } from '../constants';

interface AuthScreenProps {
  onLoginSuccess: (user: User) => void;
}

interface GoogleJwtPayload {
  email: string;
  name: string;
  picture: string;
  // ... other fields from Google JWT
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLoginSuccess }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-brand-dark">
      <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-2xl">
        <SparklesIcon className="w-12 h-12 mx-auto text-brand-blue" />
        <h1 className="mt-4 text-2xl font-bold tracking-tight text-white sm:text-3xl">
          LinkedIn Strategy Architect
        </h1>
        <p className="mt-4 text-md leading-7 text-gray-300">
          Sign in with Google to create and save your personalized LinkedIn strategy.
        </p>
        <div className="mt-8 flex items-center justify-center">
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
        <p className="text-xs text-gray-500 mt-8">By signing in, you agree to not really have any terms or conditions, because this is a demo app.</p>
      </div>
    </div>
  );
};
