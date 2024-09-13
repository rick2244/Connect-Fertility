import React, { useState } from 'react'
import Logo from './Logo.js'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth'
import {auth, db} from '/Users/richarddzreke/Documents/connect-fertility-api/client/src/lib/firebase.js'
import {doc, setDoc} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom';
import upload from '../lib/upload.js'
import Notification from './Notification/Notification.js'
import { toast } from 'react-toastify'

/**
 * 
 * @returns an html that produces the desired format for the authorization
 */
const Auth = () => {
    //sets up my cookies objects and other values that I want to set universally to a cookie
    //these will be used to decide what is veiwed when a certain action is performed 
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState(null)
    const [username, setUsername] = useState(null)
    const [password, setPassword] = useState(null)
    const [email_username, setEmail_Username] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const [avatar, setAvatar] = useState({
        file:null,
        url:''
    })
    const navigate = useNavigate()

    //controls the display of the login and sign up page
    const viewLogin = (status) =>{
        setIsLogin(status)
    }

    const handleSubmit = async (e) =>{
        e.preventDefault()
        try{
            if(!isLogin && password !== confirmPassword){
                return toast.warn('Make sure the password match!')
            }
            //set the cookies to values that are returned from my /signup url in App.js
            if(isLogin){
                let response = await fetch(`http://localhost:3001/auth/get_username_email_name?email_username=${email_username}`)
                response = await response.json()
                
                const email = response['email']
                const username = response['username']

                console.log(email)
                console.log(password)
                await signInWithEmailAndPassword(auth, email, password)

                let login = await fetch(`http://localhost:3001/auth/login`,{
                    method: 'POST',
                    headers: {'Content-Type' : 'application/json'},
                    body: JSON.stringify({email_username, password})
                })

                login = await login.json()

                if(login.detail){
                    return toast.warn(login.detail)
                }
                
                let profile_completed = await fetch(`http://localhost:3001/auth/profile_completion?email_username=${email_username}`)
                profile_completed = await profile_completed.json()
                if(profile_completed['completed'] === false){
                    console.log('Attemtping to complete form')
                    return navigate('/form')  
                }else{
                    console.log('Attempting to jump to profile')
                    navigate('/profile') 
                }                
            }else{
                const res = await createUserWithEmailAndPassword(auth, email, password)

                const imgUrl = await upload(avatar.file)

                await setDoc(doc(db, 'users', res.user.uid),{
                    username,
                    email,
                    avatar: imgUrl,
                    id: res.user.uid,
                    unmatches: [] 
                })
                await setDoc(doc(db, 'userschats', res.user.uid),{
                    chats: [],
                })

                let response = await fetch(`http://localhost:3001/auth/signup`,{
                    method: 'POST',
                    headers: {'Content-Type' : 'application/json'},
                    body: JSON.stringify({email, username, password})
                })

                response = await response.json()

                if(response.detail){
                    return toast(response.detail)
                }
                toast.success('Sign Up Succssful')
                navigate('/verification')
            }
            
        }catch(error){
            return toast.warn('Error creating or loging into account')
        }
    }

    const handleSubmitForgot = async (e) =>{
        e.preventDefault()
        navigate('/forgot_email')
    }

    const handleForgotUsername = async (e) =>{
        e.preventDefault()
        navigate('/forgot_username')
    }

    const handleAvatar = (e) =>{
        if(e.target.files[0]){
            setAvatar({
                file:e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }
    
    return (
    <div>
        <Logo/>
        <div className='auth-container'>
            <div className='auth-container-box'>
                <form>
                    <h2>{isLogin ? 'Log in': 'Create an Account'}</h2>
                    {!isLogin &&
                        <>
                        <img src={avatar?.url} alt='...'></img>
                        <label htmlFor='file'>Upload a Profile Image</label>
                        <input type='file' id='file' style={{display:'none'}} onChange={handleAvatar}/>
                        </>
                    }
                    {!isLogin && <input 
                        type='email' 
                        placeholder='email'
                        onChange={(e) => setEmail(e.target.value)}
                    />}
                    {!isLogin && <input 
                        type='username'
                        placeholder='username'
                        onChange={(e) => setUsername(e.target.value)}
                    />}
                    {isLogin && <input 
                        type='email'
                        placeholder='Enter email or username'
                        onChange={(e) => setEmail_Username(e.target.value)}
                    />}
                    <input 
                        type='password'
                        placeholder='password'
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {!isLogin && <input 
                        type='password'
                        placeholder='confirm password'
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />}
                    <input type='submit' className='create' onClick={(e) => handleSubmit(e, isLogin ? 'login' : 'signup')}/>
                   
                    {isLogin && <button type='button' className='rounded-button' onClick={(e) => handleSubmitForgot(e)}>
                        Forgot Password
                    </button>}

                    {/* Add some space between Forgot Password and Forgot Username */}
                    <div style={{ margin: '5px 0' }}></div>

                    {isLogin && <button type='button' className='rounded-button' onClick={(e) => handleForgotUsername(e)}>
                        Forgot Username
                    </button>}
                    <Notification/>              
                </form>
                <div className='auth-options'>
                    <button 
                    onClick={() => viewLogin(false)}
                    style = {{backgroundColor : !isLogin ? 'rgb(255, 255, 255)' : 'rgb(188, 188, 188)'}}
                    >Sign Up</button>
                    <button 
                    onClick={() => viewLogin(true)}
                    style = {{backgroundColor : isLogin ? 'rgb(255, 255, 255)' : 'rgb(188, 188, 188)'}}
                    >Login</button>
                </div>
            </div>
        </div>
    </div>
    );
  }
  
  export default Auth
  