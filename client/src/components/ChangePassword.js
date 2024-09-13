import React, { useState } from 'react'
import {useCookies} from 'react-cookie'
import { useNavigate } from 'react-router-dom'
/**
 * This page handles the change of passord, when the button is clicked either the passowrd is changed for the 
 * If there are errors they will pop up on the page and there won't be a switch
 * @returns an html that tells the user to verify thier email to be able to login
 */
const ForgotPassword = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [error, setError] = useState(null)
    const [password, setPassword] = useState(null)
    const [confirmPassword, setConfirmPassword] = useState(null)
    const navigate = useNavigate()
    const email = cookies.Email


    const handleSubmit = async (e) =>{
      e.preventDefault()  
      if(password === null || confirmPassword === null){
        setError('Make sure all the fields have an input.')
        return 
      }
      if(password !== confirmPassword){
        setError('Passwords do not match.')
        return 
      }
      try{
          let changed = false
          const response = await fetch(`http://localhost:3001/auth/updatepassword/${email}/${password}`,{
              method: 'PUT',
              headers: {'Content-Type' : 'application/json'},
              body: JSON.stringify({changed})
          })
          const data = await response.json()

          if(data.detail){
              setError(data.detail)
          }else{  
            navigate('/')
          }
      }catch(err){
          console.error(err)
      }
  }

    return (
      <div className='auth-container'>
        <div className='auth-container-box'>
            <form>
            <h2>{'Click link sent to your email to change the password!'}</h2>
            <p>{'Once you have then you can enter a new password for the account.'}</p>
            <input 
                type='password'
                placeholder='new password'
                onChange={(e) => setPassword(e.target.value)}
            />
            <input 
                type='password'
                placeholder='confirm new password'
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <input type='submit' className='create' onClick={(e) => handleSubmit(e)}/>
            {error && <p>{error}</p>}
            </form>
        </div>
      </div>
    );
  }
  
  export default ForgotPassword
  