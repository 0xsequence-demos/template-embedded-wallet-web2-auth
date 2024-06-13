import { useState, useEffect } from 'react'
import './App.css'
import sequence from './SequenceEmbeddedWallet'
import { useSessionHash } from './useSessionHash'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import AppleSignin from 'react-apple-signin-auth';

// Auth.js
import { UserManager } from 'oidc-client';

const oidcConfig = {
  authority: "https://accounts.google.com",
  client_id: "976261990624-2l23e456k1omvqkujclrjeniuftdj6g3.apps.googleusercontent.com",
  redirect_uri: "http://localhost:5173/callback",
  response_type: "id_token token",
  scope: "openid profile email",
};

const userManager = new UserManager(oidcConfig);

const Auth = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    userManager.getUser().then((user) => {
      if (user) {
        console.log(user)
        setUser(user);
      }
    });
  }, []);

  const login = async () => {
    count = 0
    await userManager.signinRedirect();
    userManager.getUser().then((user) => {
      if (user) {
        console.log(user)
        setUser(user);
      }
    });
  };

  const logout = () => {
    userManager.signoutRedirect();
  };

  return (
    <div>
      {user ? (
        <div>
          <h3>Welcome, {user.profile.name}</h3>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={login}>Login with Google</button>
      )}
    </div>
  );
};

let count = 0
function LoginScreen () {
  const { sessionHash } = useSessionHash()

  const [wallet, setWallet] = useState<any>(null)

  useEffect(() => {
    if(count == 0){
      count ++

    try {
      setTimeout(async () => {

        const currentUrl = window.location.href;
    
        // Step 2: Parse the URL using the URL constructor
        const url = new URL(currentUrl);
    
        // Step 3: Extract the hash part of the URL (everything after #)
        const hash = url.hash.substring(1);
    
        // Step 4: Parse the hash parameters
        const params = new URLSearchParams(hash);
    
        // Step 5: Get the id_token from the parameters
        const idToken = params.get('id_token');
    
        console.log('ID Token:', idToken);
    
        if(idToken){
          const res = await sequence.signIn({
            idToken: idToken!,
          }, "template")
          console.log(res.wallet)
          setWallet(res.wallet)
    
          
        }
    
        }, 0)
    }catch(err){
      try {
        setTimeout(async () => {

        const sessions = await sequence.listSessions()
  
        for(let i = 0; i < sessions.length; i++){
          await sequence.dropSession({ sessionId: sessions[i].id })
        }
      }, 0)

      }catch(err){
        console.log(err)
      }
    }

    }
  }, [])

  const handleGoogleLogin = async (tokenResponse: CredentialResponse) => {
    const res = await sequence.signIn({
      idToken: tokenResponse.credential!,
    }, "template")
    setWallet(res.wallet)
  }

  const handleAppleLogin = async (response: any) => {
    const res = await sequence.signIn({
      idToken: response.authorization.id_token! // inputted id token from apple
    }, "template")
 
    setWallet(res.wallet)
  }

  useEffect(() => {
    setTimeout(async () => {
      if(await sequence.isSignedIn()){
        setWallet(await sequence.getAddress())
      }
    }, 0)
  }, [])

  useEffect(() => {

  }, [wallet])

  const signOut = async () => {
    try {
      const sessions = await sequence.listSessions()

      for(let i = 0; i < sessions.length; i++){
        await sequence.dropSession({ sessionId: sessions[i].id })
      }
    }catch(err){
      console.log(err)
    }
  }

  return (
    <>
      {
        !wallet 
      ? 
        <>
          <Auth/>
          <span className='sign-in-via'>SIGN IN VIA</span>
          <br/>
          <br/>
          <br/>
          <div className="login-container">
          <div className='dashed-box-google'>
              <p className='content'>
                <div className='gmail-login' style={{overflow: 'hidden', opacity: '0',width: '90px', position: 'absolute', zIndex: 1, height: '100px'}}>
                  <GoogleLogin 
                    nonce={sessionHash}
                    key={sessionHash}
                    onSuccess={handleGoogleLogin} shape="circle" width={230} />
                  </div>
                  <span className='gmail-login'>Gmail</span>
              </p>
          </div>
          <div className='dashed-box-apple'>
            <p className='content' 
            style={{position:'relative'}}>
                <span className='apple-login'>
                  {/* @ts-ignore */}
                  <AppleSignin
                    key={sessionHash}
                    authOptions={{
                      clientId: '<replce with com. bundle id>',
                      scope: 'openid email',
                      redirectURI: '<must be a deployed URL>',
                      usePopup: true,
                      nonce: sessionHash
                    }}
                    onError={(error: any) => console.error(error)}
                    onSuccess={handleAppleLogin}
                  />Apple
                </span>
            </p>
            </div>
          </div>
        </>
      : 
        <>
          <div className="login-container">
          <p style={{cursor: 'pointer'}} onClick={() =>signOut()}>sign out</p>
          &nbsp;&nbsp;&nbsp;
          <span >{wallet}</span>
          </div>
        </>
      }
    </>
  )
}

function App() {
  return (
    <LoginScreen/>
  )
}

export default App