import React, { useState, useEffect } from 'react'
import Banner from './Banner.js'
import Chat from './Chat/Chat.js'
import List from './List/List.js'
import Detail from './Detail/Detail.js'
import { useChatStore } from '../lib/chatStore.js'

const ChatPage = () =>{
    const {chatId} = useChatStore()

    return(
        <>
            <Banner/>
            <div className='chat-container'>
                <List/>
                {chatId && <Chat/>}
                {chatId && <Detail/>}
            </div>
        </>
    )

}

export default ChatPage