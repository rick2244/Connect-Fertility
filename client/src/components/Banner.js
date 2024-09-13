import React, { useState, useEffect } from 'react'
import {useCookies} from 'react-cookie'
import logo from '/Users/richarddzreke/Documents/connect-fertility-api/client/src/gene.png'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../lib/userStore'
import { auth } from '../lib/firebase'

const Banner = () => { 
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [open, setOpen] = useState(false)
    const {currentUser} = useUserStore()
    const navigate = useNavigate()

    

    const signOut = () => {
        const cookieNames = Object.keys(cookies);

        // Remove each cookie
        cookieNames.forEach(cookieName => {
            removeCookie(cookieName);
        });
        auth.signOut()
        localStorage.clear();
        navigate('/')
    }

    const handleSwipe = async(e) =>{
        navigate('/swiping')
    }

    const handleChat = async(e) =>{
        navigate('/chat')
    }

    const viewProfile = async(e) =>{
        navigate('/profile')
    }

    const handleLikes = async(e) =>{
        navigate('/likes')
    }

    const handlePreferences = async(e)=>{
        navigate('/preferences')
    }
  
    return (
     

      <div >
        <nav>
            <div className='logo'>Connect Fertility
            <img src={logo} alt='no image' width='30' height='30'/>
            </div>
            <ul>
                <li><a href='#'>Home</a></li>
                <li><a href='#' onClick={(e) => handlePreferences(e)}>Preferences</a></li>
                <li><a href='#' onClick={(e) => handleSwipe(e)}>Start Swiping</a></li>
                <li><a href='#' onClick={(e) => handleLikes(e)}>Likes</a></li>
                <li><a href='#' onClick={(e) => handleChat(e)}>Chat</a></li>
                
            </ul>
            <svg  className='user-pic' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" onClick={() => setOpen(prev => !prev)}> <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/></svg>
            {open && <div className='sub-menu-wrap' id='subMenu'>
                <div className='sub-menu'>
                    <div className='user-info'>
                        <img htmlFor='input-file' width='75px' height='75px' src={currentUser.avatar}alt='fail' id='image-container'></img>
                        <h2>{currentUser?.name}</h2>
                    </div>
                    <hr></hr>
                    <a href='#' className='sub-menu-link'>
                    <svg className='user-pic' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" onClick={viewProfile}><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
                        <p onClick={viewProfile}>View Profile</p>
                        <span onClick={viewProfile}>{'>>'}</span>
                    </a>
                    <a href='#' className='sub-menu-link'>
                        <svg  className='user-pic' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" > <path d="M304 128a80 80 0 1 0 -160 0 80 80 0 1 0 160 0zM96 128a128 128 0 1 1 256 0A128 128 0 1 1 96 128zM49.3 464H398.7c-8.9-63.3-63.3-112-129-112H178.3c-65.7 0-120.1 48.7-129 112zM0 482.3C0 383.8 79.8 304 178.3 304h91.4C368.2 304 448 383.8 448 482.3c0 16.4-13.3 29.7-29.7 29.7H29.7C13.3 512 0 498.7 0 482.3z"/></svg>
                        <p>Edit Profile</p>
                        <span>{'>>'}</span>
                    </a>
                    <a href='#' className='sub-menu-link'>
                    <svg className='user-pic' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width='40'><path d="M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z"/></svg>
                        <p>Settings and Privacy</p>
                        <span>{'>>'}</span>
                    </a>
                    <a href='#' className='sub-menu-link'>
                    <svg className='user-pic' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512" width='40' height='40'><path d="M48 80a48 48 0 1 1 96 0A48 48 0 1 1 48 80zM0 224c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H64V256H32c-17.7 0-32-14.3-32-32z"/></svg>
                        <p>Help and Support</p>
                        <span>{'>>'}</span>
                    </a>
                    <a href='#' className='sub-menu-link' onClick={signOut}>
                    <svg className='user-pic' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width='40' height='40'><path d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"/></svg>
                        <p>Logout</p>
                        <span>{'>>'}</span>
                    </a>
                </div>
            </div>}
        </nav>
      </div>
    );
}

export default Banner