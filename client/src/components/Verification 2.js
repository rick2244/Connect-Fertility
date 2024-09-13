import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * There is a button that the user must hit to move back to the login or signup page
 * @returns an html that tells the user to verify thier email to be able to login
 */
const Verification = () => {
    const navigate = useNavigate()

    const handleSubmit = async (e) =>{
        e.preventDefault()
        navigate('/')
    }
    

    return (
      <div className='auth-container'>
        <div className='auth-container-box'>
            <form>
                <h2>{'Verify account by email sent to account!'}</h2>
                <button type='button' className='rounded-button' onClick={(e) => handleSubmit(e)}>
                    Login
                </button>
            </form>
        </div>
      </div>
    );
  }
  
  export default Verification
  