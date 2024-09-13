import { collection, query, where, getDocs, updateDoc, doc, setDoc, serverTimestamp, arrayUnion} from 'firebase/firestore'
import './addUser.css'
import { db } from '../../../../lib/firebase'
import { useState } from 'react'
import { useUserStore } from '../../../../lib/userStore'

//Allows for manual additions of users to chat with
//Not utilzied currently since the current implementation adds automatically when people match
const AddUser = () =>{
    const [user, setUser] = useState(null)
    const {currentUser} = useUserStore()


    const handleSearch = async (e) =>{
        e.preventDefault()
        const formData = new FormData(e.target)
        const username = formData.get('username')
        try{
            const userRef = collection(db, 'users')
            const q = query(userRef, where('username', '==', username))
            const querySnapShot = await getDocs(q)

            if(!querySnapShot.empty){
                setUser(querySnapShot.docs[0].data())
            }

        }catch(error){
            console.log(error.message)
        }
    }

    const handleAdd = async (e) =>{

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

            console.log(newChatRef.id)

        }catch(error){
            console.log(error.message)
        }

    }

    return(
        <div className="addUser">
            <form onSubmit={handleSearch}>
                <input type='text' placeholder='Username' name='username'></input>
                <button>Search</button>
            </form>
            {user && <div className='user'>
                <div className='detail'>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M96 128a128 128 0 1 0 256 0A128 128 0 1 0 96 128zm94.5 200.2l18.6 31L175.8 483.1l-36-146.9c-2-8.1-9.8-13.4-17.9-11.3C51.9 342.4 0 405.8 0 481.3c0 17 13.8 30.7 30.7 30.7H162.5c0 0 0 0 .1 0H168 280h5.5c0 0 0 0 .1 0H417.3c17 0 30.7-13.8 30.7-30.7c0-75.5-51.9-138.9-121.9-156.4c-8.1-2-15.9 3.3-17.9 11.3l-36 146.9L238.9 359.2l18.6-31c6.4-10.7-1.3-24.2-13.7-24.2H224 204.3c-12.4 0-20.1 13.6-13.7 24.2z"/></svg>
                    <span>{user.username}</span>
                </div>
                <button onClick={handleAdd}>Add User</button>
            </div>}
        </div>
    )
}

export default AddUser