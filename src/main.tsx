import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.tsx'
import './index.css'

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
if (!clientId) {
  throw new Error('Missing Google Client ID');
}

createRoot(document.getElementById('root')!).render(
    <GoogleOAuthProvider clientId={clientId}>
      <App />
    </GoogleOAuthProvider>
)