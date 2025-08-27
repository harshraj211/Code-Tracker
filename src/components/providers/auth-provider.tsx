
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, signInWithPopup, signOut, User, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import type { AuthFormValues } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signUpWithEmail: (values: AuthFormValues) => Promise<void>;
  signInWithEmail: (values: AuthFormValues) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleAuthSuccess = (action: string) => {
    toast({
      title: `Signed ${action}`,
      description: `Welcome! You're now signed ${action}.`,
    });
    router.push('/');
  }

  const handleAuthError = (error: any, action: string) => {
     console.error(`Error signing ${action}: `, error);
      let description = `There was a problem signing ${action}. Please try again.`;
      if (error.code === 'auth/email-already-in-use') {
        description = 'This email is already in use. Please sign in or use a different email.';
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        description = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.code === 'auth/weak-password') {
        description = 'The password is too weak. Please use a stronger password.';
      }

      toast({
        variant: "destructive",
        title: `Sign-${action} Failed`,
        description,
      });
  }

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      handleAuthSuccess('in');
    } catch (error) {
      handleAuthError(error, 'in');
    }
  };

  const signUpWithEmail = async ({ email, password }: AuthFormValues) => {
    try {
        await createUserWithEmailAndPassword(auth, email, password);
        handleAuthSuccess('up');
    } catch(error) {
        handleAuthError(error, 'up');
    }
  }

  const signInWithEmail = async ({ email, password }: AuthFormValues) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
        handleAuthSuccess('in');
    } catch(error) {
        handleAuthError(error, 'in');
    }
  }


  const signOutUser = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed Out",
        description: "You have been successfully signed out.",
      });
      router.push('/login');
    } catch (error) {
      console.error("Error signing out: ", error);
       toast({
        variant: "destructive",
        title: "Sign-out Failed",
        description: "There was a problem signing out. Please try again.",
      });
    }
  };

  const value = {
    user,
    loading,
    signInWithGoogle,
    signUpWithEmail,
    signInWithEmail,
    signOut: signOutUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
