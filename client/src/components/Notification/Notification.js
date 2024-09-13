import { ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

//used to send alerts when there is an error to users
const Notification = () =>{
    return(
        <div className="">
            <ToastContainer position='bottom-right'/>
        </div>
    )
}

export default Notification