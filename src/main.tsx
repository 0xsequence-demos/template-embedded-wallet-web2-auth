import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { useSessionHash } from "./useSessionHash.ts";

import { GoogleOAuthProvider } from '@react-oauth/google'

function Dapp() {
  const { sessionHash } = useSessionHash()

  return (
		// <GoogleOAuthProvider clientId="908369456253-9ki3cl7bauhhu61hgtb66c1ioo0u2n24.apps.googleusercontent.com" nonce={sessionHash} key={sessionHash}>
		<GoogleOAuthProvider clientId="976261990624-2l23e456k1omvqkujclrjeniuftdj6g3.apps.googleusercontent.com" nonce={sessionHash} key={sessionHash}>
			<App />
		</GoogleOAuthProvider>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Dapp />
  </React.StrictMode>
)
