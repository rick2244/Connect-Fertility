import { arrayRemove, arrayUnion, doc, updateDoc } from 'firebase/firestore'
import { useChatStore } from '../../lib/chatStore'
import { useUserStore } from '../../lib/userStore'
import './detail.css'
import cloud from '/Users/richarddzreke/Documents/connect-fertility-api/client/src/components/508-icon.png'
import { db } from '../../lib/firebase'

const Detail = () => {

    const {chatId, user, isCurrentUserUnmatched, isReceiverUnmatched, changeUnmatch} = useChatStore()
    const {currentUser} = useUserStore()

    //handles if the user unmatches
    //if a user unmatches people on both side are not able to send a chat unless the origna
    //user that unmatched decides to match again
    const handleUnmatch = async () =>{
        if(!user) return 

        const userDocRef = doc(db, 'users', currentUser.id)
        try{
            await updateDoc(userDocRef, {
                unmatches: isReceiverUnmatched ? arrayRemove(user.id) : arrayUnion(user.id)
            })
            changeUnmatch()
        }catch(error){
            console.log(error)
        }

    }

    return(
        <div className='detail'>
            <div className='user'>
                <img src={user?.avatar} alt='fail'></img>
                <h2>{user?.name}</h2>
                <p>Test details.</p>
            </div>
            <div className='info'>
                <div className='option'>
                    <div className='title'>
                        <span>Privacy & Help</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg>
                    </div>
                </div>
                <div className='option'>
                    <div className='title'>
                        <span>Shared Files</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M214.6 41.4c-12.5-12.5-32.8-12.5-45.3 0l-160 160c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 141.2V448c0 17.7 14.3 32 32 32s32-14.3 32-32V141.2L329.4 246.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3l-160-160z"/></svg>
                    </div>
                </div>
                <div className='option'>
                    <div className='title'>
                        <span>Shared Photos</span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M169.4 470.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 370.8 224 64c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 306.7L54.6 265.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
                    </div>
                        <div className='photos'>
                            <div className='photoItem'>
                                <div className='photoDetail'>
                                    <img src={cloud}></img>
                                    <span>cloud.png</span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='icon'><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>
                            </div>
                            <div className='photoItem'>
                                <div className='photoDetail'>
                                    <img src={cloud}></img>
                                    <span>cloud.png</span>
                                </div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className='icon'><path d="M288 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V274.7l-73.4-73.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l128 128c12.5 12.5 32.8 12.5 45.3 0l128-128c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L288 274.7V32zM64 352c-35.3 0-64 28.7-64 64v32c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V416c0-35.3-28.7-64-64-64H346.5l-45.3 45.3c-25 25-65.5 25-90.5 0L165.5 352H64zm368 56a24 24 0 1 1 0 48 24 24 0 1 1 0-48z"/></svg>
                            </div>
                        </div>
                    </div>
                
                <button onClick={handleUnmatch}>{
                    isCurrentUserUnmatched ? 'You are Unmatched' : isReceiverUnmatched ? 'User unmatched' : 'Unmatch User'
                }</button>
            </div>
        </div>
    )

}

export default Detail