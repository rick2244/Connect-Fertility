import { getDoc } from 'firebase/firestore'
import {db} from './firebase'
import {doc} from 'firebase/firestore'
import {create} from 'zustand'


export const useUserStore = create((set) => ({
    currentUser: null,
    isLoading: true,
    fetchUserInfo: async (uid) =>{
        console.log('checking for uid')
        if(!uid) return set({ curentUser : null, isLoading:false})

        try{
            const docRef =  doc(db, 'users', uid)
            const docSnap = await getDoc(docRef)

            if(docSnap.exists()){
                console.log('it exists')
                set({currentUser:docSnap.data(), isLoading:false})
            }else{
                console.log('it does not exist')
                set({currentUser:null, isLoading:false})
            }

        }catch(error){
            console.log(error.message)
            return set({curentUser:null, isLoading:false})
        }
    }
}))