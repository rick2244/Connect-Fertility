
import {create} from 'zustand'
import { useUserStore } from './userStore'


export const useChatStore = create((set) => ({
    chatId: null,
    user: null,
    isCurrentUserUnmatched: false,
    isReceiverUnmatched: false,
    changeChat: (chatId, user) => {
        const currentUser = useUserStore.getState().currentUser

        //CHECK IF CURRENT USER IS UNMATCHED
        if(user.unmatches.includes(currentUser.id)){
            return set({
                chatId,
                user: null,
                isCurrentUserUnmatched: true,
                isReceiverUnmatched: false,
            })
        }

        //CHECK IF RECEIVER IS UNMATCHED
        else if(currentUser.unmatches.includes(user.id)){
            return set({
                chatId,
                user: user,
                isCurrentUserUnmatched: false,
                isReceiverUnmatched: true,
            })
        }else{

            return set({
                chatId,
                user,
                isCurrentUserUnmatched: false,
                isReceiverUnmatched: false,
            })
        }
    },

    changeUnmatch: ()=>{
        set(state=>({...state,isReceiverUnmatched: !state.isReceiverUnmatched}))
    },
}))