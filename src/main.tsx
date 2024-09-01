import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

import { ProgressProvider } from './stores';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ProgressProvider>
      <App />
    </ProgressProvider>
  </StrictMode>,
)
