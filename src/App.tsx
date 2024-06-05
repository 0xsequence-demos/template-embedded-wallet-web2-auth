import { useState, useEffect } from 'react'
import sequence from './SequenceEmbeddedWallet'
import { useSessionHash } from './useSessionHash'
import { CredentialResponse, GoogleLogin } from '@react-oauth/google';
import AppleSignin from 'react-apple-signin-auth';
import './App.css'
import playImage from './assets/play.svg'

function LoginScreen () {
  const { sessionHash } = useSessionHash()

  const [wallet, setWallet] = useState<any>(null)
  const [googleHover, setGoogleHover] = useState(false)
  const [appleHover, setAppleHover] = useState(false)

  const handleGoogleLogin = async (tokenResponse: CredentialResponse) => {
    const res = await sequence.signIn({
      idToken: tokenResponse.credential!
    }, "Dungeon Minter")
    setWallet(res.wallet)
  }

  const handleAppleLogin = async (response: any) => {
    const res = await sequence.signIn({
      idToken: response.authorization.id_token!
    }, "Dungeon Minter")
 
    setWallet(res.wallet)
  }

  useEffect(() => {
    setTimeout(async () => {
      console.log(await sequence.isSignedIn())
      if(await sequence.isSignedIn()){
        setWallet(await sequence.getAddress())
      }
    }, 0)
  }, [])

  useEffect(() => {

  }, [googleHover, appleHover, wallet])

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
                <div className='gmail-login' onMouseLeave={() => setGoogleHover(false)} onMouseEnter={() => {setGoogleHover(true)}} style={{overflow: 'hidden', opacity: '0',width: '90px', position: 'absolute', zIndex: 1, height: '100px'}}>
                  {
                  googleHover && <GoogleLogin 
                    nonce={sessionHash}
                    key={sessionHash}
                    onSuccess={handleGoogleLogin} shape="circle" width={230} /> }
                  </div>
                  <span className='gmail-login'>Gmail</span>
                  {googleHover && <img src={playImage} alt="Play" className="play-image-gmail" />}
              </p>
          </div>
          <div className='dashed-box-apple'>
            <p className='content' 
            onMouseLeave={() => setAppleHover(false)} 
            onMouseEnter={() => {setAppleHover(true)}}
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
                {appleHover && <img src={playImage} alt="Play" className="play-image-apple" />}
            </p>
            </div>
          </div>
        </>
      : 
        <p>{wallet}</p>
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
