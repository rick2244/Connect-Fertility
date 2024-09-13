import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Logo from './Logo.js'
import { useNavigate } from 'react-router-dom'
import { useUserStore } from '../lib/userStore.js'
import Notification from './Notification/Notification.js'
import { toast } from 'react-toastify'
import { db } from '../lib/firebase.js'
import { doc, updateDoc } from 'firebase/firestore'

/**
 * There is a button that the user must hit to move back to the login or signup page
 * @returns an html that tells the user to verify thier email to be able to login
 */
const Welcome = () => {
    const { currentUser } = useUserStore()
    const [name, setName] = useState(null)
    const [occupation, setOccupation] = useState(null)
    const [hobbies, setHobbies] = useState('')
    const [bio, setBio] = useState('')
    const [currLocation, setCurrLocation] = useState([])
    const navigate = useNavigate()
    const maxLength = 100
    const username = currentUser?.username

    const signOut = () => {
        //auth.signOut()
        navigate('/')
    }

    
    
    const getFirstCheckedCheckboxValue = () => {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        for (const checkbox of checkboxes) {
            if (checkbox.checked) {
                return checkbox.value;
            }
        }
        return null; // Return null if no checkbox is checked
    }

    const getLocation = async () =>{
        const location = await axios.get('https://ipapi.co/json')
        setCurrLocation(location.data)
    }

    useEffect(() =>{
        getLocation();
    }, [])

    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try{
            const BloodDropdown = document.getElementById('Blooddropdown')
            const HairDropdown = document.getElementById('Hairdropdown')
            const EyeDropdown = document.getElementById('Eyedropdown')
            const Ethnicitydropdown = document.getElementById('Ethnicitydropdown')
            const EducationDropdown = document.getElementById('Educationdropdown')
            const MaritalDropdown = document.getElementById('Maritaldropdown')
            const SexDropdown = document.getElementById('Sexdropdown')
            const ClassificationDropdown = document.getElementById('Classificationdropdown')
            const PreferenceDropdown = document.getElementById('Preferencedropdown')

            let month = document.getElementById('month')
            month = parseInt(month.value)
            let day = document.getElementById('day')
            day = parseInt(day.value)
            let year = document.getElementById('year')
            year = parseInt(year.value)
            let ft = document.getElementById('ft')
            ft = parseInt(ft.value)
            let inches = document.getElementById('in')
            inches = parseInt(inches.value)
            let lbs = document.getElementById('lbs')
            lbs = parseInt(lbs.value)

            const latitude = currLocation.latitude
            const longitude = currLocation.longitude
            const city = currLocation.city
            const region = currLocation.region
        
            const race = getFirstCheckedCheckboxValue()

            HairDropdown.addEventListener('submit', handleSubmit)
            BloodDropdown.addEventListener('submit', handleSubmit)
            EyeDropdown.addEventListener('submit', handleSubmit)
            Ethnicitydropdown.addEventListener('submit', handleSubmit)
            EducationDropdown.addEventListener('submit', handleSubmit)
            MaritalDropdown.addEventListener('submit', handleSubmit)
            SexDropdown.addEventListener('submit', handleSubmit)
            ClassificationDropdown.addEventListener('submit', handleSubmit)
            PreferenceDropdown.addEventListener('submit', handleSubmit)
    
            const currentDate = new Date();
    
            const currentYear = currentDate.getFullYear();
    
            let age = currentYear - year
    
            const hasBirthdayOccurred = month < currentDate.getMonth() + 1 || (month == currentDate.getMonth() && day < currentDate.getDate())
    
            if(!hasBirthdayOccurred){
                age--
            }
            if(age < 18){
                toast.warn('Must be at least 18 years old to register')
            }
            
            //error  handleing
            if(name === null || occupation === null || hobbies === null || bio === null){
                return toast.warn('Please fill out all fields')
            }else if(race === null){
                return toast.warn('Race not selected')
            }else if(month > 12 || month < 1 || month === null){
                return toast.warn('Value must be between 1 to 12 for month in Date of Birth!')
            }else if(day > 31 || day < 1){
                return toast.warn('Value must be between 1 to 31 for days in Date or Birth!')
            }else if(year > currentYear){
                return toast.warn(`Date of Birth year cannot be above ${year}`)
            }else if(ft > 9 || ft < 1){
                return toast.warn('Feet has to be between 1 to 9 feet!')
            }else if(inches > 11 || inches < 1){
                return toast.warn('Inches must be between 1-11 inches')
            }else if(lbs > 1200){
                return toast.warn('Weight cannot be above 1200 lbs!')
            }
            
            //inserts data collected into postgresSQL database
            await fetch(`http://localhost:3001/profile_start/${name}/${day}/${month}/${year}/${age}/${latitude}/${longitude}/${city}/${region}/${race}/${Ethnicitydropdown.value}/${BloodDropdown.value}/${HairDropdown.value}/${EyeDropdown.value}/${EducationDropdown.value}/${occupation}/${MaritalDropdown.value}/${ft}/${inches}/${lbs}/${hobbies}/${bio}/${SexDropdown.value}/${ClassificationDropdown.value}/${PreferenceDropdown.value}/${username}`,{
                method: 'PUT',
                headers: {'Content-TYpe' : 'application/json'},
                body: JSON.stringify({})
            })

            /* The classification dropdown value is being reassigned to the table that is associated with
            the classification that the user wants to be part of */
            let classification = ClassificationDropdown.value
            if(classification === 'Surrogate Mother'){
                classification = 'surrogate_mothers'
            }else if(classification === 'Client'){
                classification = 'client'
            }else if(classification === 'Sperm Donor'){
                classification = 'sperm_donors'
            }
            
            //adding user to right classification table
            await fetch(`http://localhost:3001/update_tables?table=${classification}&username=${username}`,{
                method: 'POST',
                headers: {'Content-TYpe' : 'application/json'},
            })

            //updates firebase data base
            await updateDoc(doc(db, 'users', currentUser?.id),{
                name: name,
                classification: ClassificationDropdown.value,
            })
            navigate('/add_pics') 
        }catch(error){
            console.log(error.message)
            return toast.warn('Not all fields are filled in')
        }
    }
   
    return (  
        <div>
            <Logo/>
            <div className='green-banner'>
                <div className='button-container'>
                <button className='signout' onClick={signOut}>SIGN OUT</button>
                <p><br /></p>
                <form >
                    <div className='input-box'>
                    <h1 className="title">Welcome to Connect Fertility</h1>
                    <h1 className='title-small'>Answer Questions to fill out your profile! </h1>
                    <div className='input'>
                        <label className='header'> Name: </label>
                        <input
                            type='name' 
                            placeholder='Enter name'
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <label className='header'>{'Date of Birth:'}</label>
                        <input className='small-box' type="number" placeholder="MM" id="month" max='12' min='1'></input>
                        <input className='small-box' type="number" placeholder="DD" id="day" max='31' min='1'></input>
                        <input className='small-box'type="number" placeholder="YYYY" id="year" min='1925'></input>
                        <label className='header'>{'Ethnicity:'}</label>
                        <select className='custom-dropdown' id="Ethnicitydropdown">
                        <option value="Hispanic or Latino">Hispanic or Latino</option>
                        <option value="Not Hispanic or Latino">Not Hispanic or Latino</option>
                        </select>

                    </div>
                    <br></br>
                    <div className='input'>
                        <label className='header'>{'Sex:'}</label>
                        <select className='custom-dropdown' id="Sexdropdown">
                        <option value="male">male</option>
                        <option value="female">female</option>
                        </select>

                        <label className='header'> Classification: </label>
                        <select className='custom-dropdown' id="Classificationdropdown">
                        <option value="Client">Client</option>
                        <option value="Sperm Doner">Sperm Donor</option>
                        <option value="Surrogate Mother">Surrogate Mother</option>
                        </select>        
                    </div>
                    <br/>
                    <div className='input'>
                    
                        <label className='header'>{'Race:\n'}</label>
                        

                        <input type="checkbox" id="preference1" name="preference1" value="American Indian or Alaska Native"></input>
                        <label >{' American Indian or Alaska Native '}</label>

                        <input type="checkbox" id="preference2" name="preference2" value="Asian"></input>
                        <label >{' Asian '}</label>

                        <input type="checkbox" id="preference3" name="preference3" value="Black or African American"></input>
                        <label >{' Black or African American '}</label>

                        <input type="checkbox" id="preference4" name="preference4" value="Native Hawaiian or Other Pacific Islander"></input>
                        <label >{' Native Hawaiian or Other Pacific Islander '}</label>

                        <input type="checkbox" id="preference5" name="preference5" value="White"></input>
                        <label >{' White '}</label><br></br>
                        <input type="checkbox" id="preference6" name="preference6" value="NA"></input>
                        <label >{' N/A '}</label><br></br>
                    </div>
                    <br></br>
                    <div className='input'>
                        <label className='header'>{'Blood Type:'}</label>
                        <select className='custom-dropdown' id="Blooddropdown">
                            <option value="0-">O-</option>
                            <option value="O+">O+</option>
                            <option value="A">A-</option>
                            <option value="A+">A+</option>
                            <option value="B-">B-</option>
                            <option value="B+">B+</option>
                            <option value="AB">AB-</option>
                            <option value="AB+">AB+</option>
                        </select>

                        <label className='header'> Hair Color: </label>
                        <select className='custom-dropdown' id="Hairdropdown">
                            <option value="Black">Black</option>
                            <option value="Brown">Brown</option>
                            <option value="Blonde">Blonde</option>
                            <option value="White/Grey">White/Grey</option>
                            <option value="Red">Red</option>
                        </select>
                        
                        <label className='header'> Eye Color: </label>
                        <select className='custom-dropdown' id="Eyedropdown">
                            <option value='Brown'>Brown</option>
                            <option value='Dark Brown'>Dark Brown</option>
                            <option value="Amber">Amber</option>
                            <option value="Blue">Blue</option>
                            <option value="Grey">Grey</option>
                            <option value="Green">Green</option>
                            <option value="Hazel">Hazel</option>
                            <option value="Red">Red</option>   
                        </select>
                    </div>

                    <br></br>
                    <div className='input'>
                        <label className='header'>{'Education Level:'}</label>
                            <select className='custom-dropdown' id="Educationdropdown">
                            <option value="High School">HighSchool</option>
                            <option value="Associate's Degree In Progress">Associate's Degree In Progress</option>
                            <option value="Associate's Degree">Associate's Degree</option>
                            <option value="Bachelor's Degree In Progress">Bachelor's Degree In Progress</option>
                            <option value="Bachelor's Degree">Bachelor's Degree</option>
                            <option value="Master's Degree In Progress">Master's Degree In Progress</option>
                            <option value="Master's Degree">Master's Degree</option>                  
                            <option value="Doctorate In Progress">Doctorate In Progress</option>
                            <option value="Doctorate">Doctorate</option>
                            </select>

                            <label className='header'> Occupation: </label>
                            <input 
                                type='occupation' 
                                placeholder='Enter your occupation'
                                onChange={(e) => setOccupation(e.target.value)}
                            />

                    </div>
                    <br></br>
                    <div className='input'>
                        <label className='header'> Marital Status: </label>
                        <select className='custom-dropdown' id="Maritaldropdown">
                        <option value="Married">Married</option>
                        <option value="Not Married">Not Married</option>
                        <option value="In a Relationship">In a Relationship</option>
                        <option value='Single'>Single</option>
                        </select>
                        <label className='header'>Height (in inches):</label>
                        <input className='small-box' type="number" placeholder="ft" id="ft" max='9' min='0'></input>
                        <input className='small-box' type="number" placeholder="in" id="in" max='11' min='0'></input>
                        <label className='header' >Weight (in lbs):</label>
                        <input className='small-box' type="number" placeholder="lbs" id="lbs" min='1' max='900'></input>
                    </div>
                    <br></br>
                    <div className='input'>
                    <label className='header'> Interests/Hobbies: </label>
                    <input 
                            type='hobbies' 
                            className='really-big-box'
                            placeholder='Enter any hobbies/interests you would like to share'
                            maxLength={maxLength} // Set maximum character limit
                
                            onChange={(e) => setHobbies(e.target.value)}
                        />
                        <p>{`\tCharacter Count: ${hobbies.replace(/\s/g, '').length}/${maxLength}`}</p>
                    </div>
                    <br></br>
                    <div className='input'>
                    <label className='header'> About Me/Bio/Health: </label>
                    <input 
                            type='bio' 
                            className='really-big-box'
                            placeholder='Write a brief bio about yourself'
                            maxLength={maxLength} // Set maximum character limit
                
                            onChange={(e) => setBio(e.target.value)}
                        />
                        <p>{`\tCharacter Count: ${bio.replace(/\s/g, '').length}/${maxLength}`}</p>

                    </div>
                    <br/>
                    <div className='input'>
                        <label className='header'>{'What are you looking for?'}</label>
                        <select className='custom-dropdown' id="Preferencedropdown">
                        <option value="client">Clients</option>
                        <option value="sperm_donors">Sperm Donors</option>
                        <option value="surrogate_mothers">Surrogate Mothers</option>
                        </select>
                    </div>
                    <br/>
                    <button type='button' className='rounded-button-big' onClick={(e) => handleSubmit(e)}>
                        Proceed
                    </button>
                    <Notification/>    
                </div>
                </form>
            
            </div>
            </div>
        </div>
        
    );
  }
  
  export default Welcome
  