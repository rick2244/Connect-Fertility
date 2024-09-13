import React, { useState, useEffect } from 'react'
import Banner from './Banner.js'
import { useUserStore } from '../lib/userStore.js'


const Likes = () => {
    const [images, setImages] = useState([])
    const [info, setInfo] = useState(new Map())
    const [userInfo, setUserInfo] = useState(new Map())
    const [users, setUsers] = useState([])
    const [user, setUser] = useState('')
    const [getinfo, setGetInfo] = useState(false)
    const [match, setMatch] = useState(false)
    const [usersLoaded, setUsersLoaded] = useState(false)
    const [nextUser, setNextUser] = useState(false)
    const [infoCollected, setInfoCollected] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const { currentUser } = useUserStore()

    let name = ''
    const username = currentUser?.username

    //get images assocated with the user that has liked thier profile
    const getPics = async (user) =>{
        try{
            let usersLiking = await fetch(`http://localhost:3001/get_images?username=${user}`)

            let data = await usersLiking.json()

            const imgs = []
            console.log(user)
            for (const key in data) {
                for(const key2 in data[key]){
                    imgs.push(data[key][key2])
                }
            }
            setImages(imgs)
            if(imgs.length === 6){
                setIsLoaded(true)
            }
        }catch(error){
            console.log(error.message)

        }
    }

    const getInfo = async (username, where) =>{
        try{
            let usersLiking = await fetch(`http://localhost:3001/get_info?username=${username}`)
            usersLiking = await usersLiking.json()

            if(where === 1){
                setInfo(usersLiking)
                setGetInfo(true)
            }else{
                setUserInfo(usersLiking) 
                setInfoCollected(true)
            }
        }catch(error){
            console.log(error.message)
        }
    }

    const getUsers = async () =>{
        try{

            //get list of other users
            let usersIncoming = await fetch(`http://localhost:3001/get_users_actions/incoming?username=${info['username']}`)
            usersIncoming = await usersIncoming.json()
            
            const incoming = new Set()
            if(usersIncoming.length > 0){
                usersIncoming.forEach(item =>{
                    incoming.add(item)
                })
            }

            //get a list of the users that have liked the users's profile
            let usersLiked = await fetch(`http://localhost:3001/get_users_actions/likes?username=${info['username']}`)
            usersLiked = await usersLiked.json()
            
            
            const liked = new Set()
            if(usersLiked.length > 0){
                usersLiked.forEach(item =>{
                    liked.add(item)
                })
            }


            //get list of other users that the user has disliked in the past
            let usersDisliked = await fetch(`http://localhost:3001/get_users_actions/dislikes?username=${info['username']}`)
            usersDisliked = await usersDisliked.json()

            const disliked = new Set()
            if(usersDisliked.length > 0){
                usersDisliked.forEach(item =>{
                    disliked.add(item)
                })
            }

            //get list of other users the user has matched with alreqady
            let usersMatched = await fetch(`http://localhost:3001/get_users_actions/matches?username=${info['username']}`)
            usersMatched = await usersMatched.json()
            
            const matches = new Set()
            if(usersMatched.length > 0){
                usersMatched.forEach(item =>{
                    matches.add(item)
                })
            }

            let uniqueUsers = new Set([...usersIncoming].filter(item => !liked.has(item)))
            uniqueUsers = new Set([...uniqueUsers].filter(item => !disliked.has(item)))
            uniqueUsers = new Set([...uniqueUsers].filter(item => !matches.has(item)))

            const UniUsers = []

            uniqueUsers.forEach(item =>{
                UniUsers.push(item)
            })

            setUsers(UniUsers)

        }catch(error){
            console.log(error.message)
        }
    }

    console.log(users)

    const dislike_like_user = async (e, like) =>{
        e.preventDefault()
        try{
            let endpoint = ''
            if(!like){
                endpoint = 'dislikes'
            }else{
                endpoint = 'likes'
            }
            
            if(users.length == 0){
                setIsLoaded(false)
                setInfoCollected(false)
            }else{
                let usersLiking = await fetch(`http://localhost:3001/update_likes_dislikes?table=${endpoint}&username=${username}&user=${user}`,{
                    method: 'POST',
                    headers: {'Content-Type' : 'application/json'},
                })

                usersLiking = await usersLiking.json()
    
                setMatch(false)
    

                console.log(user)

                const updatedUsers = users.filter(item => item !== user);

                setUsers(updatedUsers);
    
                // If there are remaining users, proceed
                if (updatedUsers.length > 0) {
                    const person = updatedUsers[0];
                    setUser(person);
                    getPics(person);
                    getInfo(person, 0);
                }
            }
        }catch(error){
            console.log(error.message)
        }
    }

    useEffect(() =>{
        if(currentUser === undefined){
            return <div>Loading...</div>
        } 
        if (!getinfo) {
            getInfo(username, 1);
        } else if (!usersLoaded && getinfo) {
            setUsersLoaded(true)
            getUsers();
        } else if (usersLoaded && !nextUser) {
            let iterator = users.values()
            setUser(iterator.next().value)
            
            if(user !== undefined && user !== ''){
                setNextUser(true)
                getPics(user);
                getInfo(user, 0);
            }
        }
    }, [info, users, images, user])

    name = userInfo['name']

    return(
        <div>
            <form>
                <Banner/>
                <br></br>
                <div className='container-profile-name'>
                    <div className='input'>
                        <svg xmlns="http://www.w3.org/2000/svg" className='user-pic-red' viewBox="0 0 384 512" height='50' onClick={(e) => dislike_like_user(e, false)}><path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"/></svg>
                        <h1>{users.length > 0 && name}</h1>
                        {match && <h2>{'Matched'}</h2>}
                        {users.length === 0 && <h1>Out of Users</h1>}
                        <svg xmlns="http://www.w3.org/2000/svg" className='user-pic' viewBox="0 0 448 512" height='50' onClick={(e) => dislike_like_user(e, true)}><path d="M416 0c17.7 0 32 14.3 32 32c0 59.8-30.3 107.5-69.4 146.6c-28 28-62.5 53.5-97.3 77.4l-2.5 1.7c-11.9 8.1-23.8 16.1-35.5 23.9l0 0 0 0 0 0-1.6 1c-6 4-11.9 7.9-17.8 11.9c-20.9 14-40.8 27.7-59.3 41.5H283.3c-9.8-7.4-20.1-14.7-30.7-22.1l7-4.7 3-2c15.1-10.1 30.9-20.6 46.7-31.6c25 18.1 48.9 37.3 69.4 57.7C417.7 372.5 448 420.2 448 480c0 17.7-14.3 32-32 32s-32-14.3-32-32H64c0 17.7-14.3 32-32 32s-32-14.3-32-32c0-59.8 30.3-107.5 69.4-146.6c28-28 62.5-53.5 97.3-77.4c-34.8-23.9-69.3-49.3-97.3-77.4C30.3 139.5 0 91.8 0 32C0 14.3 14.3 0 32 0S64 14.3 64 32H384c0-17.7 14.3-32 32-32zM338.6 384H109.4c-10.1 10.6-18.6 21.3-25.5 32H364.1c-6.8-10.7-15.3-21.4-25.5-32zM109.4 128H338.6c10.1-10.7 18.6-21.3 25.5-32H83.9c6.8 10.7 15.3 21.3 25.5 32zm55.4 48c18.4 13.8 38.4 27.5 59.3 41.5c20.9-14 40.8-27.7 59.3-41.5H164.7z"/></svg>
                    </div>

                </div>
                <br></br>
                <div className='container-profile-name'>
                    <div className='photos-container'>
                        <p className='title'>Photos</p>
                        <br></br>
                        <p>-------------------------------------------------------------------</p>
                        <img className='photo' src={(isLoaded  && users.length !== 0) ? images[0]?.secure_url : 'Pulling images'} alt='pulling images'>
                        </img>
                        <p>-------------------------------------------------------------------</p>

                        <img className='photo' src={(isLoaded  && users.length !== 0) ? images[1]?.secure_url : 'Pulling images'} alt='pulling images'>
                        </img>
                        <p>-------------------------------------------------------------------</p>
                        <img className='photo' src={(isLoaded  && users.length !== 0) ? images[2]?.secure_url : 'Pulling images'} alt='pulling images'>
                        </img>
                        <p>-------------------------------------------------------------------</p>
                        <img className='photo' src={(isLoaded  && users.length !== 0) ? images[3]?.secure_url : 'Pulling images'} alt='pulling images'>
                        </img>
                        <p>-------------------------------------------------------------------</p>
                        <img className='photo' src={(isLoaded  && users.length !== 0) ? images[4]?.secure_url : 'Pulling images'} alt='pulling images'>
                        </img>
                        <p>-------------------------------------------------------------------</p>
                        <img className='photo' src={(isLoaded  && users.length !== 0) ? images[5]?.secure_url : 'Pulling images'} alt='pulling images'>
                        </img>
                    </div>
                </div>
                <div className='container-profile-info'>
                    <div className='profile-info-container'>
                        {(infoCollected && users.length !== 0) ? 
                        <><div className='input-profile'>
                            <h1>{`Age: ${userInfo['age']}`}</h1>
                                <h1>{`Height: ${userInfo['ft']}' ${userInfo['inches']}\"`}</h1>
                            </div>
                            <br/>
                            <div className='input-profile'>
                                <h1>{`Sex: ${userInfo['sex']}`}</h1>
                                <h1>{`Classification: ${userInfo['classification']}`}</h1>
                            </div>
                            <br/>
                            <div className='input-profile'>
                                <h1>{`Weight: ${userInfo['weight']}lbs`}</h1>
                                <h1>{`Home: ${userInfo['city']}, ${userInfo['region']}`}</h1>
                            </div>
                            <br/>
                            <div className='input-profile'>
                                <h1>{`Race: ${userInfo['race']}`}</h1>
                            </div>
                            <br/>
                            <div className='input-profile'>
                                <h1>{`Ethnicity: ${userInfo['ethnicity']}`}</h1>
                            </div>
                            <br/>
                            <div className='input-profile'>
                                <h1>{`Blood: ${userInfo['blood']}`} <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" height='30' style={{ fill: 'red' }}><path d="M192 512C86 512 0 426 0 320C0 228.8 130.2 57.7 166.6 11.7C172.6 4.2 181.5 0 191.1 0h1.8c9.6 0 18.5 4.2 24.5 11.7C253.8 57.7 384 228.8 384 320c0 106-86 192-192 192zM96 336c0-8.8-7.2-16-16-16s-16 7.2-16 16c0 61.9 50.1 112 112 112c8.8 0 16-7.2 16-16s-7.2-16-16-16c-44.2 0-80-35.8-80-80z"/></svg></h1>
                                <h1>{`Hair: ${userInfo['hair']}`}</h1>
                                <h1>{`Eye Color: ${userInfo['eye']}`} <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" height='30' ><path d="M288 80c-65.2 0-118.8 29.6-159.9 67.7C89.6 183.5 63 226 49.4 256c13.6 30 40.2 72.5 78.6 108.3C169.2 402.4 222.8 432 288 432s118.8-29.6 159.9-67.7C486.4 328.5 513 286 526.6 256c-13.6-30-40.2-72.5-78.6-108.3C406.8 109.6 353.2 80 288 80zM95.4 112.6C142.5 68.8 207.2 32 288 32s145.5 36.8 192.6 80.6c46.8 43.5 78.1 95.4 93 131.1c3.3 7.9 3.3 16.7 0 24.6c-14.9 35.7-46.2 87.7-93 131.1C433.5 443.2 368.8 480 288 480s-145.5-36.8-192.6-80.6C48.6 356 17.3 304 2.5 268.3c-3.3-7.9-3.3-16.7 0-24.6C17.3 208 48.6 156 95.4 112.6zM288 336c44.2 0 80-35.8 80-80s-35.8-80-80-80c-.7 0-1.3 0-2 0c1.3 5.1 2 10.5 2 16c0 35.3-28.7 64-64 64c-5.5 0-10.9-.7-16-2c0 .7 0 1.3 0 2c0 44.2 35.8 80 80 80zm0-208a128 128 0 1 1 0 256 128 128 0 1 1 0-256z"/></svg></h1>
                            </div>
                            <br/>
                            <div className='input-profile'>
                                <h1>{`Education: ${userInfo['education']}`} <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" height='30'><path d="M337.8 5.4C327-1.8 313-1.8 302.2 5.4L166.3 96H48C21.5 96 0 117.5 0 144V464c0 26.5 21.5 48 48 48H256V416c0-35.3 28.7-64 64-64s64 28.7 64 64v96H592c26.5 0 48-21.5 48-48V144c0-26.5-21.5-48-48-48H473.7L337.8 5.4zM96 192h32c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H96c-8.8 0-16-7.2-16-16V208c0-8.8 7.2-16 16-16zm400 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H512c-8.8 0-16-7.2-16-16V208zM96 320h32c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H96c-8.8 0-16-7.2-16-16V336c0-8.8 7.2-16 16-16zm400 16c0-8.8 7.2-16 16-16h32c8.8 0 16 7.2 16 16v64c0 8.8-7.2 16-16 16H512c-8.8 0-16-7.2-16-16V336zM232 176a88 88 0 1 1 176 0 88 88 0 1 1 -176 0zm88-48c-8.8 0-16 7.2-16 16v32c0 8.8 7.2 16 16 16h32c8.8 0 16-7.2 16-16s-7.2-16-16-16H336V144c0-8.8-7.2-16-16-16z"/></svg></h1>
                            </div>
                            <br/>
                            <div className='input-profile'>
                                <h1>{`Occupation: ${userInfo['occupation']}`} <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" height='30'><path d="M224 256A128 128 0 1 0 224 0a128 128 0 1 0 0 256zm-96 55.2C54 332.9 0 401.3 0 482.3C0 498.7 13.3 512 29.7 512H418.3c16.4 0 29.7-13.3 29.7-29.7c0-81-54-149.4-128-171.1V362c27.6 7.1 48 32.2 48 62v40c0 8.8-7.2 16-16 16H336c-8.8 0-16-7.2-16-16s7.2-16 16-16V424c0-17.7-14.3-32-32-32s-32 14.3-32 32v24c8.8 0 16 7.2 16 16s-7.2 16-16 16H256c-8.8 0-16-7.2-16-16V424c0-29.8 20.4-54.9 48-62V304.9c-6-.6-12.1-.9-18.3-.9H178.3c-6.2 0-12.3 .3-18.3 .9v65.4c23.1 6.9 40 28.3 40 53.7c0 30.9-25.1 56-56 56s-56-25.1-56-56c0-25.4 16.9-46.8 40-53.7V311.2zM144 448a24 24 0 1 0 0-48 24 24 0 1 0 0 48z"/></svg></h1>
                            </div>
                            <br/>
                            <div className='input-profile'>
                                <h1>{`Marital Status: ${userInfo['marital']}`}</h1>
                            </div>
                            <br/>
                            <div className='input-profile'>
                                <h2>{`Hobbies: ${userInfo['hobbies']}`}</h2>
                            </div>
                            <br/>
                            <div className='input-profile'>
                                <h2>{`Bio: ${userInfo['bio']}`}</h2>
                            </div>
                        </>
                        : 'Pulling info'}
                        
                    </div>

                </div>
            </form>
        </div>

    )
}

export default Likes