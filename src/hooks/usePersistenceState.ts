import { useState } from 'react';

const store = localStorage;

/**
 * store state to localStorage
 * @param key unique key
 * @param initialValue init state if not exist in localStorage
 * @returns 
 */
export function usePersistenceState<T>(key: string, initialValue: T){
  let originValue = store.getItem(key);
  if(originValue !== null){
    initialValue = JSON.parse(originValue) as T;
  }
  
  const [origin, setOrigin] = useState<T>(initialValue);

  const state = origin;
  const setState = (newVal: T) => {
    store.setItem(key, JSON.stringify(newVal));
    setOrigin(newVal);
  }

  return [state, setState] as const;
}