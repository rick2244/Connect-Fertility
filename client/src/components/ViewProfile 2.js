import React, { useState, useEffect } from 'react'
import Banner from './Banner.js'
import { useUserStore } from '../lib/userStore.js'


const ViewProfile = () => {
    const [images, setImages] = useState([])
    const [info, setInfo] = useState([])
    const [infoCollected, setInfoCollected] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const {currentUser, isLoading} = useUserStore()
    const name = currentUser?.name
    const username = currentUser?.username
    

    //retrieves pics assocaited with the user from cloudinary database
    const getPics = async () =>{
        try{
            let response = await fetch(`http://localhost:3001/get_images?username=${username}`)

            let data = await response.json()

            const imgs = []
            for (const key in data) {
                for(const key2 in data[key]){
                    imgs.push(data[key][key2])
                }
            }
            setImages(imgs)
            setIsLoaded(true)
            
        }catch(error){
            console.log(error.message)

        }
    }

    //gets necessary info associated with user to display their profile
    const getInfo = async () =>{
        try{
            let response = await fetch(`http://localhost:3001/get_info?username=${username}`)
            response = await response.json()
            setInfo(response)
            setInfoCollected(true)
        }catch(error){
            console.log(error.message)
        }
    }


    useEffect(() =>{
        if (isLoading) return <div className='loading'>Loading...</div>
        if(images.length === 0){
            getPics()
        }
    }, [images])

    useEffect(() =>{
        console.log('about to get info')
        console.log(username)
        if(info.length === 0 && username !== undefined){
            getInfo()
        }
    }, [images])




    return(
        <div>
            <form>
                <Banner/>
                <br></br>
                <div className='container-profile-name'>
                    <div className='input'>
                        <h1>{name}</h1>
                    </div>

                </div>
                <br></br>
                <div className='container-profile-name'>
                    <div className='photos-container'>
                        <p className='title'>Photos</p>
                        <br></br>
                        <p>-------------------------------------------------------------------</p>
                        <img className='photo' src={!isLoaded ? 'Pulling images' : images[0]?.secure_url} alt='pulling images'>
                        </img>
                        <p>-------------------------------------------------------------------</p>

                        <img className='photo' src={!isLoaded ? 'Pulling images' : images[1]?.secure_url} alt='pulling images'>
                        </img>
                        <p>-------------------------------------------------------------------</p>
                        <img className='photo' src={!isLoaded ? 'Pulling images' : images[2]?.secure_url} alt='pulling images'>
                        </img>
                        <p>-------------------------------------------------------------------</p>
                        <img className='photo' src={!isLoaded ? 'Pulling images' : images[3]?.secure_url} alt='pulling images'>
                        </img>
                        <p>-------------------------------------------------------------------</p>
                        <img className='photo' src={!isLoaded ? 'Pulling images' : images[4]?.secure_url} alt='pulling images'>
                        </img>
                        <p>-------------------------------------------------------------------</p>
                        <img className='photo' src={!isLoaded ? 'Pulling images' : images[5]?.secure_url} alt='pulling images'>
                        </img>
                    </div>
                </div>
                <div className='container-profile-info'>
                    <div className='profile-info-container'>
                        {!infoCollected ? 'Loading info':
                        <><div className='input-profile'>
                            <h1>{`Age: ${info['age']}`}</h1>
                                <h1>{`Height: ${info['ft']}' ${info['inches']}\"`}</h1>
                            </div>
                            <br/>
                            <div className='input-profile'>
                                <h1>{`Sex: ${info['sex']}`}</h1>
                                <h1>{`Classification: ${info['classification']}`}</h1>
                            </div>
                            <br/>
                            <div className='input-profile'>
                                <h1>{`Weight: ${info['weight']}lbs`}</h1>
                                <h1>{`Home: ${info['city']}, ${info['region']}`}</h1>
                            </div>
                            <br/>
                            <div className='input-profile'>
                                <h1>{`Race: ${info['race']}`}</h1>
                            </div>
                            <br/>
                            <div className='input-profile'>
                                <h1>{`Ethnicity: ${info['ethnicity']}`}</h1>
                            </div>
                            <br/>
                            <div className='input-profile'>
                                <h1>{`Blood: ${info['blood']}`} <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height='30' style={{ fill: 'red' }}><path d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0h1.8c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z"/></svg></h1>
                                <h1>{`Hair: ${info['hair']}`}</h1>
                                <h1>{`Eye Color: ${info['eye']}`} <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height='30' ><path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"/></svg></h1>
                            </div>
                            <br/>
                            <div className='input-profile'>
                                <h1>{`Education: ${info['education']}`} <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" height='30'><path d="M337.8 5.4C327-1.8 313-1.8 302.2 5.4L166.3 96H48C21.5 96 0 117.5 0 144V464c0 26.5 21.5 48 48 48H256V416c0-35.3 28.7-64 64-64s64 28.7 64 64v96H592c26.5 0 48-21.5 48-48V144c0-26.5-21.5-48-48-48H473.7L337.8 5.4zM96 192h32c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H96c-8.8 0-16-7.2-16-16V208c0-8.8 7.2-16 16-16zm400 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H512c-8.8 0-16-7.2-16-16V208zM96 320h32c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H96c-8.8 0-16-7.2-16-16V336c0-8.8 7.2-16 16-16zm400 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H512c-8.8 0-16-7.2-16-16V336zM232 176a88 88 0 1 1 176 0 88 88 0 1 1 -176 0zm88-48c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H336V144c0-8.8-7.2-16-16-16z"/></svg></h1>
                            </div>
                            <br/>
                            <div className='input-profile'>
                                <h1>{`Occupation: ${info['occupation']}`} <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height='30'><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-96 55.2C54 332.9 0 401.3 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7c0-81-54-149.4-128-171.1V362c27.6 7.1 48 32.2 48 62v40c0 8.8-7.2 16-16 16H336c-8.8 0-16-7.2-16-16s7.2-16 16-16V424c0-17.7-14.3-32-32-32s-32 14.3-32 32v24c8.8 0 16 7.2 16 16s-7.2 16-16 16H256c-8.8 0-16-7.2-16-16V424c0-29.8 20.4-54.9 48-62V304.9c-6-.6-12.1-.9-18.3-.9H178.3c-6.2 0-12.3 .3-18.3 .9v65.4c23.1 6.9 40 28.3 40 53.7c0 30.9-25.1 56-56 56s-56-25.1-56-56c0-25.4 16.9-46.8 40-53.7V311.2zM144 448a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg></h1>
                            </div>
                            <br/>
                            <div className='input-profile'>
                                <h1>{`Marital Status: ${info['marital']}`}</h1>
                            </div>
                            <br/>
                            <div className='input-profile'>
                                <h2>{`Hobbies: ${info['hobbies']}`}</h2>
                            </div>
                            <br/>
                            <div className='input-profile'>
                                <h2>{`Bio: ${info['bio']}`}</h2>
                            </div>
                        </>
                        }
                        
                    </div>

                </div>
            </form>
        </div>

    )
}

export default ViewProfile