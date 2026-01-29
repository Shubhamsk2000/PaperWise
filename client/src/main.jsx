import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from 'react-hot-toast';
import ServerCheck from './components/ServerCheck.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ServerCheck />
    <Toaster />
    <App />
  </StrictMode>,
)
