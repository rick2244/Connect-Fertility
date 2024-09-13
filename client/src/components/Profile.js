import React, { useState, useEffect } from 'react'
import {useCookies} from 'react-cookie'
import Banner from './Banner.js'
import { useNavigate } from 'react-router-dom'


/**
 * There is the window that shows a user's profile for the firest time
 * @returns an html that allows the user to see what their profile looks like to others
 */
const Profile = () => {
    const navigate = useNavigate()

    const viewProfile = async (e) =>{
        e.preventDefault()
        navigate('/profile')
    }

    
    return (
        <div className='content'>
            <form>
            <Banner/>
               
                <h1 className='title'>Great Job, Profile Completed!</h1>
        
                <div className='container'>
                    <svg className='check' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M64 80c-8.8 0-16 7.2-16 16V416c0 8.8 7.2 16 16 16H384c8.8 0 16-7.2 16-16V96c0-8.8-7.2-16-16-16H64zM0 96C0 60.7 28.7 32 64 32H384c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM337 209L209 337c-9.4 9.4-24.6 9.4-33.9 0l-64-64c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0l47 47L303 175c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9z"/></svg>
                </div>  
                <div className='container-view-profile'>
                    <button type='button' className='view-profile' onClick={(e) => viewProfile(e)}>
                        View Profile
                    </button>
                </div>         
            </form>
        </div>
    );
  }
  
  export default Profile