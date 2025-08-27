"use client";

import { useState, useEffect } from 'react';

// A custom hook to synchronize state with localStorage
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    // This function is only executed on the initial render.
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  // This effect listens for changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // On initial load, make sure we have the latest value from localStorage
    try {
        const item = window.localStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
         console.log(error)
      }


    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key]);

  return [storedValue, setValue];
}

    