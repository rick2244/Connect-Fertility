import React, { useState } from 'react'
import {useCookies} from 'react-cookie'
import { useNavigate } from 'react-router-dom'

/**
 * This is where a person enters the email connected to the account that they want to change the password to
 * @returns an html that produces the desired format for the authorization
 */
const ForgotPasswordEmail = () => {
    //sets up my cookies objects and other values that I want to set universally to a cookie
    //these will be used to decide what is veiwed when a certain action is performed 
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [email, setEmail] = useState(null)
    const [error, setError] = useState(null)
    const navigate = useNavigate()

    console.log(cookies);

    const handleSubmit = async (e) =>{
        console.log(email)
        e.preventDefault()  
        try{
            const forgotPassword = true
            const response = await fetch(`http://localhost:3001/auth/get_emails/${email}/${forgotPassword}`)
            const hasEmail = await response.json()
            if(!hasEmail){
                setError('Account doesn\'t exist that is connected to this email.')
                return
            }
            if(hasEmail.detail){
                setError(hasEmail.detail)
            }else{ 
                setCookie('Email', email)
                navigate('/forgot_password')
            }
        }catch(err){
            console.error(err)
        }

        //reloads the window so that a new window pops up after the the submit button is clicked
        window.location.reload()
    }
    const handleLogin = async (e) =>{
        console.log(email)
        e.preventDefault()  
        try{
            removeCookie('Email')
            navigate('/')  
        }catch(err){
            console.error(err)
        }
    }

    return (
      <div className='auth-container'>
        <div className='auth-container-box-small'>
            <form>
                <h2>{'Please enter the email connected to your account!\n'}</h2>
                <p>{'Click the link sent to your email to reset your password'}</p>
                <input 
                    type='email' 
                    placeholder='email'
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input type='submit' className='create' onClick={(e) => handleSubmit(e)}/>
                {error && <p>{error}</p>}
                <button type='button' className='rounded-button' onClick={(e) => handleLogin(e)}>
                    Back To Login
                </button>
            </form>
        </div>
      </div>
    );
  }
  
  export default ForgotPasswordEmail
  