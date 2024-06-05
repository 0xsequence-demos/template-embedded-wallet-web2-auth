import { useState, useEffect } from 'react'
import './App.css'
import sequence from './SequenceEmbeddedWallet'
import { useSessionHash } from './useSessionHash'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import AppleSignin from 'react-apple-signin-auth';
import playImage from './assets/play.svg'

function LoginScreen () {
  const { sessionHash } = useSessionHash()

  const [wallet, setWallet] = useState<any>(null)

  const handleGoogleLogin = async (tokenResponse: CredentialResponse) => {
    const res = await sequence.signIn({
      idToken: tokenResponse.credential! // inputted id credential from google
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