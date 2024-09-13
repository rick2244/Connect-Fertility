import './chatList.css'
import { useUserStore } from '../../../lib/userStore'
import { useEffect, useState } from 'react'
import { db } from '../../../lib/firebase'
import AddUser from './addUser/AddUser.js' 
import { useChatStore } from '../../../lib/chatStore'
import { onSnapshot, getDoc, collection, query, where, getDocs, updateDoc, doc, setDoc, serverTimestamp, arrayUnion} from 'firebase/firestore'

const ChatList = () => {

    const [chats, setChats] = useState([])
    const [input, setInput] = useState('')
    const {currentUser} = useUserStore()
    const { changeChat} = useChatStore()
    const [getUsers, setGetUsers] = useState(false)

    useEffect(()=>{
        const unSub = onSnapshot(doc(db, "userschats", currentUser.id), async (res)=>{
            const items = res.data()?.chats
            const promisses = items?.map(async (item) =>{
                const userDocRef = doc(db, 'users', item.receiverId)
                const userDocSnap = await getDoc(userDocRef)

                const user = userDocSnap.data()

                return {...item, user}
            })
            if(promisses?.length > 0){
                const chatData = await Promise.all(promisses)
                setChats(chatData.sort((a,b) => b.updatedAt - a.updatedAt))
            }
            setGetUsers(true)
        })

        return () =>{
            unSub()
        }

    }, [currentUser.id])

    const handleSelect = async (chat) =>{
        const userChats = chats.map(item=>{
            const {user, ...rest} = item
            return rest
        })

        const chatIndex = userChats.findIndex(item=>item.chatId === chat.chatId)

        userChats[chatIndex].isSeen = true

        const userChatsRef = doc(db, 'userschats', currentUser.id)

        try{
            await updateDoc(userChatsRef,{
                chats: userChats,
                
            })
            changeChat(chat.chatId, chat.user)
        }catch(error){
            console.log(error.message)
        }   
    }

    const handleAdd = async (user) =>{
        const chatRef = collection(db, 'chats')
        const userChatsRef = collection(db, 'userschats')

        try{
            const newChatRef = doc(chatRef)
            await setDoc(newChatRef, {
                createdAt: serverTimestamp(),
                messages: [],
            })

            await updateDoc(doc(userChatsRef, user.id),{
                chats:arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage:'',
                    receiverId: currentUser.id,
                    updatedAt: Date.now(),
                })
            })

            await updateDoc(doc(userChatsRef, currentUser.id),{
                chats:arrayUnion({
                    chatId: newChatRef.id,
                    lastMessage:'',
                    receiverId: user.id,
                    updatedAt: Date.now(),
                })
            })
        }catch(error){
            console.log(error.message)
        }
    }

    const updateUsers = async () =>{
        try{
            console.log('Trying to update chat list')
            let response = await fetch(`http://localhost:3001/get_matches?username=${currentUser?.username}`)
            response = await response.json()

            if(response.length === 0){
                return
            }
            
            response.forEach(async username =>{
                const userRef = collection(db, 'users')
                const q = query(userRef, where('username', '==', username))
                const querySnapShot = await getDocs(q)
    
                if(!querySnapShot.empty){
                    const user = querySnapShot.docs[0].data()
                    const hasUsername = chats.filter(c=> c.user.username.toLowerCase().includes(user.username.toLowerCase()))
                    if(hasUsername?.length === 0){
                        await handleAdd(user)  
                    }
                }
            })
        }catch(error){
            console.log(error.message)
        }
    }



    useEffect(() =>{
        if(getUsers){
            setGetUsers(false)
            updateUsers()
        }
    }, [getUsers])


    const filteredChats = chats.filter(c=> c.user.name.toLowerCase().includes(input.toLowerCase()))
    return(
        <div className='chatList'>
            <div className='search'>
                <div className='searchBar'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" height='40px'><path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"/></svg>
                    <input type='text' placeholder='Search' onChange={(e) => setInput(e.target.value)}></input>
                </div>
            </div>
            
            {chats.length > 0 && filteredChats?.map((chat) => (<div className='item' key={chat.chatId} onClick={() => handleSelect(chat)} style={{backgroundColor: chat?.isSeen ? 'transparent' : '#5183fe'}}>
                <img src={chat.user?.avatar} alt='fail'></img>
                <div className='texts'>
                    <span>{chat.user.unmatches.includes(currentUser.id) ? 'User' : chat.user.name}</span>
                    <p>{chat.lastMessage}</p>
                </div>
            </div>
            ))}
            
        </div>
    )

}

export default ChatList