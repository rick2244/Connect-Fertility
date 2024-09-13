import './chat.css'
import EmojiPicker from 'emoji-picker-react'
import cloud from '/Users/richarddzreke/Documents/connect-fertility-api/client/src/components/508-icon.png'
import {useRef, useState, useEffect} from 'react'
import { onSnapshot, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { useChatStore } from '../../lib/chatStore'
import { useUserStore } from '../../lib/userStore'
import upload from '../../lib/upload'

const Chat = () => {

    const [openEmoji, setOpenEmoji] = useState(false)
    const [chat, setChat] = useState()
    const [text, setText] = useState("")
    const [img, setImg] = useState({
        file:null,
        url:'',
    })

    const {currentUser} = useUserStore()
    const {chatId, user, isCurrentUserUnmatched, isReceiverUnmatched} = useChatStore()

    const endRef = useRef(null)

    useEffect(()=>{
        endRef.current?.scrollIntoView({behavior : 'smooth'})
    }, [])

    useEffect(()=>{
        const unSub = onSnapshot(doc(db, 'chats', chatId), (res)=>{
            setChat(res.data())
        })

        return () =>{
            unSub()
        }
    }, [chatId])

    //handles when an emoji is being sent
    const handleEmoji = e =>{
        setText((prev) => prev + e.emoji)
        setOpenEmoji(false)
    }

    //handles when an image is sent with a chat
    const handleImg = (e) =>{
        if(e.target.files[0]){
            setImg({
                file: e.target.files[0],
                url: URL.createObjectURL(e.target.files[0])
            })
        }
    }

    //handles when someone sends a message
    const handleSend = async () =>{
        if(text === "") return
        let imgUrl = null

        try{

            if(img.file){
                imgUrl = await upload(img.file)
            }

            await updateDoc(doc(db, 'chats', chatId),{
                messages:arrayUnion({
                    senderId: currentUser.id,
                    text,
                    createdAt: new Date(),
                    ...(imgUrl && {img : imgUrl})
                })
            })

            const userIDs = [currentUser.id, user.id]

            userIDs.forEach(async (id) => {
                const userChatRef = doc(db, 'userschats', id)
                const userChatSnapshot = await getDoc(userChatRef)
    
                if(userChatSnapshot.exists()){
                    const userChatsData = userChatSnapshot.data()
                    
                    const chatIndex = userChatsData.chats.findIndex(c=> c.chatId === chatId)
    
                    userChatsData.chats[chatIndex].lastMessage = text
                    userChatsData.chats[chatIndex].isSeen = id === currentUser.id ? true : false
                    userChatsData.chats[chatIndex].updateAt = Date.now()
    
                    await updateDoc(userChatRef, {
                        chats: userChatsData.chats,
    
                    })
                }

            })

        }catch(error){
            console.log(error.message)
        }

        setImg({
            file:null,
            url:'',
        })

        setText('')
    }

    return(
        <div className='chat'>
            <div className='top'>
                <div className='user'>
                    <img src={user?.avatar} alt='fail'></img>
                        <div className='texts'>
                            <span>{user?.name}</span>
                            <p>This is just info</p>
                        </div>
                </div>
                <div className='icons'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M164.9 24.6c-7.7-18.6-28-28.5-47.4-23.2l-88 24C12.1 30.2 0 46 0 64C0 311.4 200.6 512 448 512c18 0 33.8-12.1 38.6-29.5l24-88c5.3-19.4-4.6-39.7-23.2-47.4l-96-40c-16.3-6.8-35.2-2.1-46.3 11.6L304.7 368C234.3 334.7 177.3 277.7 144 207.3L193.3 167c13.7-11.2 18.4-30 11.6-46.3l-40-96z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path d="M0 128C0 92.7 28.7 64 64 64H320c35.3 0 64 28.7 64 64V384c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V128zM559.1 99.8c10.4 5.6 16.9 16.4 16.9 28.2V384c0 11.8-6.5 22.6-16.9 28.2s-23 5-32.9-1.6l-96-64L416 337.1V320 192 174.9l14.2-9.5 96-64c9.8-6.5 22.4-7.2 32.9-1.6z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 192 512"><path d="M48 80a48 48 0 1 1 96 0A48 48 0 1 1 48 80zM0 224c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V448h32c17.7 0 32 14.3 32 32s-14.3 32-32 32H32c-17.7 0-32-14.3-32-32s14.3-32 32-32H64V256H32c-17.7 0-32-14.3-32-32z"/></svg>
                </div>
            </div>
            <div className='center'>
                {chat?.messages?.map((message) => (<div className={message.senderId === currentUser?.id ? 'message own' : 'message'} key={message?.createdAt}>
                    {message.senderId === currentUser?.id  && <img src={currentUser.avatar} alt='fail'></img>}
                    {message.senderId !== currentUser?.id  && <img src={user?.avatar} alt='fail'></img>}
                    <div className='texts'>
                        {message.img && <img src={message.img}></img>}
                        <p>{message.text}</p>
                    </div>
                </div>))}
                {img.url && 
                <div className='message own'>
                    <div className='texts'>
                        <img src={img.url} alt=''></img>

                    </div>

                </div>}

                
                <div ref={endRef}></div>
            </div>
            <div className='bottom'>
                <div className='icons'>
                    <label htmlFor='file'>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32H448c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zM323.8 202.5c-4.5-6.6-11.9-10.5-19.8-10.5s-15.4 3.9-19.8 10.5l-87 127.6L170.7 297c-4.6-5.7-11.5-9-18.7-9s-14.2 3.3-18.7 9l-64 80c-5.8 7.2-6.9 17.1-2.9 25.4s12.4 13.6 21.6 13.6h96 32H424c8.9 0 17.1-4.9 21.2-12.8s3.6-17.4-1.4-24.7l-120-176zM112 192a48 48 0 1 0 0-96 48 48 0 1 0 0 96z"/></svg>
                    </label>
                    <input type='file' id='file' style={{display:'none'}} onChange={handleImg}></input>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M149.1 64.8L138.7 96H64C28.7 96 0 124.7 0 160V416c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V160c0-35.3-28.7-64-64-64H373.3L362.9 64.8C356.4 45.2 338.1 32 317.4 32H194.6c-20.7 0-39 13.2-45.5 32.8zM256 192a96 96 0 1 1 0 192 96 96 0 1 1 0-192z"/></svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M192 0C139 0 96 43 96 96V256c0 53 43 96 96 96s96-43 96-96V96c0-53-43-96-96-96zM64 216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 89.1 66.2 162.7 152 174.4V464H120c-13.3 0-24 10.7-24 24s10.7 24 24 24h72 72c13.3 0 24-10.7 24-24s-10.7-24-24-24H216V430.4c85.8-11.7 152-85.3 152-174.4V216c0-13.3-10.7-24-24-24s-24 10.7-24 24v40c0 70.7-57.3 128-128 128s-128-57.3-128-128V216z"/></svg>
                </div>
                <input type='text' placeholder={isCurrentUserUnmatched || isReceiverUnmatched ? 'You cannot send a message' : 'Type a message...'} value={text} onChange={(e) => setText(e.target.value)} disabled={isCurrentUserUnmatched || isReceiverUnmatched}></input>
                <div className='emoji'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" onClick={() => setOpenEmoji((prev) => !prev)}><path d="M500.3 7.3C507.7 13.3 512 22.4 512 32V176c0 26.5-28.7 48-64 48s-64-21.5-64-48s28.7-48 64-48V71L352 90.2V208c0 26.5-28.7 48-64 48s-64-21.5-64-48s28.7-48 64-48V64c0-15.3 10.8-28.4 25.7-31.4l160-32c9.4-1.9 19.1 .6 26.6 6.6zM74.7 304l11.8-17.8c5.9-8.9 15.9-14.2 26.6-14.2h61.7c10.7 0 20.7 5.3 26.6 14.2L213.3 304H240c26.5 0 48 21.5 48 48V464c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V352c0-26.5 21.5-48 48-48H74.7zM192 408a48 48 0 1 0 -96 0 48 48 0 1 0 96 0zM478.7 278.3L440.3 368H496c6.7 0 12.6 4.1 15 10.4s.6 13.3-4.4 17.7l-128 112c-5.6 4.9-13.9 5.3-19.9 .9s-8.2-12.4-5.3-19.2L391.7 400H336c-6.7 0-12.6-4.1-15-10.4s-.6-13.3 4.4-17.7l128-112c5.6-4.9 13.9-5.3 19.9-.9s8.2 12.4 5.3 19.2zm-339-59.2c-6.5 6.5-17 6.5-23 0L19.9 119.2c-28-29-26.5-76.9 5-103.9c27-23.5 68.4-19 93.4 6.5l10 10.5 9.5-10.5c25-25.5 65.9-30 93.9-6.5c31 27 32.5 74.9 4.5 103.9l-96.4 99.9z"/></svg>
                    <div className='picker'>
                        {openEmoji && <EmojiPicker onEmojiClick={handleEmoji}/>}
                    </div>
                </div>
                <button className='sendButton' onClick={handleSend} disabled={isCurrentUserUnmatched || isReceiverUnmatched}>Send</button>
            </div>
        </div>
    )

}

export default Chat