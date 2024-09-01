import React, { createContext, useReducer, useContext, useEffect } from 'react';
import reducer from './reducer';
import { State, Action } from './types';

/**
 * initial state if not found in local storage
 */
const initialState: State = {
  progress: []
};

/**
 * context object
 */
const ProgressContext = createContext<{
  state: State,
  dispatch: React.Dispatch<Action>
} | undefined>(undefined);

/**
 * provider used to wrap the app
 * @param param0 
 * @returns 
 */
export const ProgressProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [state, dispatch] = useReducer(reducer, undefined, loadStateFromLocalStorage);

  // use effect to save state to local storage
  useEffect(() => {
    saveStateToLocalStorage(state);
  }, [state]);

  return (
    <ProgressContext.Provider value={{state, dispatch}}>
      { children }
    </ProgressContext.Provider>
  );
}

/**
 * used by components that need to access the store
 * @returns 
 */
export const useProgressStore = () => {
  const context = useContext(ProgressContext);
  if(!context){
    throw new Error('useProgressStore must be used within a ProgressProvider');
  }
  return context;
}

/**
 * Local Storage PREFIX Key
 */
const LOCAL_STORAGE_KEY = 'progress-store';

/**
 * load state from local storage  
 * if not found, use initial state
 */
const loadStateFromLocalStorage = (): State => {
  try{
    const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if(serializedState === null){
      return initialState;
    }
    return JSON.parse(serializedState) as State;
  }catch(err){
    console.error('Could not load state from localStorage', err);
    return initialState;
  }
}

/**
 * save state to local storage
 * @param state 
 */
const saveStateToLocalStorage = (state: State) => {
  try{
    const serializedState = JSON.stringify(state);
    localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
  }catch(err){
    console.error('Could not save state to localStorage', err);
  }
}