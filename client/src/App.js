import Auth from './components/Auth'
import {React ,useEffect, useState} from 'react'
import {useCookies} from 'react-cookie'
import Verification from './components/Verification'
import ForgotPassword from './components/ChangePassword'
import ForgotPasswordEmail from './components/ForgotPasswordEmail'
import ForgotUsernameEmail from './components/ForgotUsernameEmail'
import Welcome from './components/Welcome'
import AddPics from './components/AddPics'
import Profile from './components/Profile'
import ViewProfile from './components/ViewProfile'
import Swipe from './components/Swipe'
import ChatPage from './components/ChatPage'
import {auth} from './lib/firebase.js'
import { onAuthStateChanged } from 'firebase/auth'
import { useUserStore } from './lib/userStore'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Likes from './components/Likes'
import Preferences from './components/Preferences/Preferences'

/**
 * 
 * @returns The returns an html that displays the current window that the app is at
 * That is usually dependent on the state of the values associated with cookies
 */
const App = () => {

  const [cookies, setCookie, removeCookie] = useCookies(null)
  const {currentUser, isLoading, fetchUserInfo} = useUserStore()


  useEffect(() =>{
    const unSub = onAuthStateChanged(auth, (user) =>{
      if(currentUser === null){
        fetchUserInfo(user?.uid)
      }
    })

    return () =>{
      unSub()
    }

  }, [fetchUserInfo])

  if (isLoading) return <div className='loading'>Loading...</div>
  console.log(currentUser)
  
  return (
    <Router>
      <div className='app'>
        <Routes>
          <Route exact path='/' Component={Auth}/>
          <Route path='/forgot_email' Component={ForgotPasswordEmail}/>
          <Route path='/forgot_password' Component={ForgotPassword}/>
          <Route path='/forgot_username' Component={ForgotUsernameEmail}/>
          <Route path='/verification' Component={Verification}/>
          <Route path='/form' Component={Welcome}/>
          <Route path='/add_pics' Component={AddPics}/>
          <Route path='/done_with_profile' Component={Profile}/>
          <Route path='/profile' Component={ViewProfile}/>
          <Route path='/swiping' Component={Swipe}/>
          <Route path='/chat' Component={ChatPage}/>
          <Route path='/likes' Component={Likes}/>
          <Route path='/preferences' Component={Preferences}/>
          </Routes>
      </div>
    </Router>
  );
}

export default App
