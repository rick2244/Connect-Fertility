import React, { useState, useEffect } from 'react'
import {useCookies} from 'react-cookie'
import icon from '/Users/richarddzreke/Documents/connect-fertility-api/client/src/components/508-icon.png'
import Logo from './Logo.js'
import { useNavigate } from 'react-router-dom'
import Notification from './Notification/Notification.js'
import { toast } from 'react-toastify'
import { useUserStore } from '../lib/userStore.js'

const AddPics = () => {
    const [cookies, setCookie, removeCookie] = useCookies(null)
    const [isLoading, setIsLoading] = useState(false)
    const { currentUser } = useUserStore()
    const navigate = useNavigate()

    const username = currentUser.username

    //uploads individual images to the cloudinary database
    function uploadImage(inputFilePrime, imageViewPrime){
        let imgLink = URL.createObjectURL(inputFilePrime.files[0])
        imageViewPrime.style.backgroundImage = `url(${imgLink})`
        imageViewPrime.textContent = ''
        imageViewPrime.style.border = 0
    }

    //handles if the user pics a different image in the preview
    const handleImageChange = async (input, drop, img) =>{
        const inputFile = document.getElementById(input)
        const dropArea = document.getElementById(drop)
        const imageView = document.getElementById(img)

        inputFile.addEventListener('change', () => uploadImage(inputFile, imageView))

        dropArea.addEventListener('dragover', function(e){
            e.preventDefault()
        })
        
        dropArea.addEventListener('drop', function(e){
            e.preventDefault()
            inputFile.files = e.dataTransfer.files
            uploadImage(inputFile, imageView)
        })

           // Trigger the upload immediately after file selection
        if (inputFile.files.length > 0) {
            uploadImage(inputFile, imageView);
        }
       
    } 

    const signOut = () => {
        const cookieNames = Object.keys(cookies);

        // Remove each cookie
        cookieNames.forEach(cookieName => {
            removeCookie(cookieName);
        });

        navigate('/')
    }

    //uploads all of the six images
    const uploadImages = async (e) =>{
        e.preventDefault()
        try{
            const formData = new FormData()

               
            formData.append('upload_preset', 'rickrolled')
            formData.append('cloud_name', 'dbfnpkamc')
            formData.append('folder', `${username}` )

            setIsLoading(true)
            let files = []
            //creates a list containing the image files
            for (let i = 1; i <= 6; i++){
                const inputFile = document.getElementById(`input-file${i}`);
                files.push(inputFile)
            }

            //loops through list and adds the files to cloudinary folder associated with user
            for(const file of files){
                if(!file.files[0]){
                    setIsLoading(false)
                    return toast.warn('Upload images for  each available slot')
                }
                formData.append(`file`, file.files[0])

                await fetch(`https://api.cloudinary.com/v1_1/dbfnpkamc/image/upload`,{
                    method: 'POST',
                    body: formData
                })
            }

            //update boolean value that shows the user is full registerd to true
            await fetch(`http://localhost:3001/form_filled?username=${username}`,{
                method: 'PUT',
                headers: {'Content-Type' : 'application/json'},
            })
            navigate('/done_with_profile')
        }catch(error){
            return toast.warn('Error uploading images')
        }
    }




    return(
        <div>
            <Logo/>
        <div className='green-banner'>
            <div>
                <button className='signout' onClick={signOut}>SIGN OUT</button>
                <p><br /></p>
                
                    <h1 className="title">Upload some images to complete your profile!</h1>
                        <div className='input-box-big'>
                            <br></br>

                            <label htmlFor='input-file1' id="drop-area1">
                                <input type='file' accept='image/*' id='input-file1'  onChange={() => handleImageChange('input-file1', 'drop-area1', 'img-view1' )} hidden/>
                                <div id='img-view1'>
                                    <img src={icon} alt='not able to find' />
                                    <p>Drag and drop or click here to add image</p>
                                    <span>Upload any images from desktop</span>

                                </div>
                            </label>

                            <label htmlFor='input-file2' id="drop-area2">
                                <input type='file' accept='image/*' id='input-file2'  onChange={() => handleImageChange('input-file2', 'drop-area2', 'img-view2' )} hidden/>
                                <div id='img-view2'>
                                    <img src={icon} alt='not able to find' />
                                    <p>Drag and drop or click here to add image</p>
                                    <span>Upload any images from desktop</span>

                                </div>
                            </label>
                    
                            <label htmlFor='input-file3' id="drop-area3">
                                <input type='file' accept='image/*' id='input-file3'  onChange={() => handleImageChange('input-file3', 'drop-area3', 'img-view3' )} hidden/>
                                <div id='img-view3'>
                                    <img src={icon} alt='not able to find' />
                                    <p>Drag and drop or click here to add image</p>
                                    <span>Upload any images from desktop</span>

                                </div>
                            </label>
                        </div>
                        <div className='input-box-big'>
                            <label htmlFor='input-file4' id="drop-area4">
                                <input type='file' accept='image/*' id='input-file4'  onChange={() => handleImageChange('input-file4', 'drop-area4', 'img-view4' )} hidden/>
                                <div id='img-view4'>
                                    <img src={icon} alt='not able to find' />
                                    <p>Drag and drop or click here to add image</p>
                                    <span>Upload any images from desktop</span>

                                </div>
                            </label>

                            <label htmlFor='input-file5' id="drop-area5">
                                <input type='file' accept='image/*' id='input-file5'  onChange={() => handleImageChange('input-file5', 'drop-area5', 'img-view5' )} hidden/>
                                <div id='img-view5'>
                                    <img src={icon} alt='not able to find' />
                                    <p>Drag and drop or click here to add image</p>
                                    <span>Upload any images from desktop</span>

                                </div>
                            </label>

                            <label htmlFor='input-file6' id="drop-area6">
                                <input type='file' accept='image/*' id='input-file6'  onChange={() => handleImageChange('input-file6', 'drop-area6', 'img-view6' )} hidden/>
                                <div id='img-view6'>
                                    <img src={icon} alt='not able to find' />
                                    <p>Drag and drop or click here to add image</p>
                                    <span>Upload any images from desktop</span>

                                </div>
                            </label>
                        </div>
                        
                
                {isLoading ? 'Uploading...' : <button type='button' className='rounded-button' onClick={(e) => uploadImages(e)}>
                    Add Images
                </button>}
                <Notification/>
            </div>
        </div>
        </div>
        
    )
}

export default AddPics