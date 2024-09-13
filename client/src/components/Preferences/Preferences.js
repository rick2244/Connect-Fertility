import {React, useEffect, useState } from "react";
import Banner from "../Banner"
import './preferences.css'

const Preferences = () =>{

    const [selectedSex, setSelectedSex] = useState('none')
    const [selectedRace, setSelectedRace] = useState('none')
    const [selectedBlood, setSelectedBlood] = useState('none')
    const [selectedHair, setSelectedHair] = useState('none')
    const [selectedEye, setSelectedEye] = useState('none')
    const [selectedEducation, setSelectedEducation] = useState('none')
    const [selectedFt, setSelectedFt] = useState('1')
    const [selectedIn, setSelectedIn] = useState('1')
    const [distance, setDistance] = useState(() => {
        return parseInt(localStorage.getItem('maxDistance')) || 20;
    })
    const [age, setAge] = useState(() => {
        return parseInt(localStorage.getItem('maxAge')) || 40;
    })

    // Retrieve the selected sex from local storage when the component mounts
    useEffect(() => {
        const storedSex = localStorage.getItem('selectedSex')
        if (storedSex) {
            setSelectedSex(storedSex)
        }

        const storedRace = localStorage.getItem('selectedRace')
        if (storedRace) {
            setSelectedRace(storedRace)
        }

        const storedBlood = localStorage.getItem('selectedBlood')
        if (storedBlood) {
            setSelectedBlood(storedBlood)
        }

        const storedHair = localStorage.getItem('selectedHair')
        if(storedHair){
            setSelectedHair(storedHair)
        }

        const storedEye = localStorage.getItem('selectedEye')
        if(storedEye){
            setSelectedEye(storedEye)
        }

        const storedEducation = localStorage.getItem('selectedEducation')
        if(storedEducation){
            setSelectedEducation(storedEducation)
        }

        const storedFt = localStorage.getItem('selectedFt')
        if(storedFt){
            setSelectedFt(storedFt)
        }

        const storedIn = localStorage.getItem('selectedIn')
        if(storedIn){
            setSelectedIn(storedIn)
        }
    }, [])

    // Handler function to update the selected sex and save it to local storage
    const handleChange = (key) => (e) => {
        const item = e.target.value
        if(key === 'selectedSex'){
            setSelectedSex(item)
        }else if(key === 'selectedRace'){
            setSelectedRace(item)
        }else if(key === 'selectedBlood'){
            setSelectedBlood(item)
        }else if(key === 'selectedHair'){
            setSelectedHair(item)
        }else if(key === 'selectedEye'){
            setSelectedEye(item)
        }else if(key === 'selectedEducation'){
            setSelectedEducation(item)
        }else if(key === 'selectedFt'){
            setSelectedFt(item)
        }else if(key === 'selectedIn'){
            setSelectedIn(item)
        }
    }

    const handleDistanceChange = (e) =>{
        setDistance(parseInt(e.target.value))
    }

    const handleAgeChange = (e) =>{
        setAge(parseInt(e.target.value))
    }

    //once a person hits the submit button the changes that they choose are actuallys and of
    //refresh they are displayed as they are updated
    const handleSubmit = (e) =>{
        e.preventDefault() 
        localStorage.setItem('selectedSex', selectedSex)
        localStorage.setItem('selectedRace', selectedRace)
        localStorage.setItem('selectedBlood', selectedBlood)
        localStorage.setItem('selectedHair', selectedHair)
        localStorage.setItem('selectedEye', selectedEye)
        localStorage.setItem('selectedEducation', selectedEducation)
        localStorage.setItem('selectedFt', selectedFt )
        localStorage.setItem('selectedIn', selectedIn)
        localStorage.setItem('maxDistance', distance.toString())
        localStorage.setItem('maxAge', age.toString())
        window.location.reload()
    }

    return(
        <div className="preferences">
            <Banner/>
            <form>
                <br/>

                <button onClick={handleSubmit}>Change Preferences</button>

                
                <br/>
                <br/>

                <div className="input">
                    <label className="header">Sex:</label>
                    <select className="custom-dropdown" id='sexDropdown' value={selectedSex} onChange={handleChange('selectedSex')}>
                        <option value='none'>none</option>
                        <option value='male'>male</option>
                        <option value='female'>female</option>
                    </select>

                    <label className="header">Race:</label>
                    <select className="custom-dropdown" id="raceDropdwon" value={selectedRace} onChange={handleChange('selectedRace')}>
                        <option value='none'>none</option>
                        <option value='American Indian or Alaska Native'>American Indian or Alaska Native</option>
                        <option value='Asian'>Asian</option>
                        <option value='Black or African American'>Black or African American</option>
                        <option value='Native Hawaiian or Other Pacific Islander'>Native Hawaiian or Other Pacific Islander</option>
                        <option value='White'>White</option>
                    </select>
                    
                    <label className="header">Blood Type:</label>
                    <select className="custom-dropdown" id="bloodDropdown" value={selectedBlood} onChange={handleChange('selectedBlood')}>
                        <option value="none">none</option>
                        <option value="0-">O-</option>
                        <option value="O+">O+</option>
                        <option value="A">A-</option>
                        <option value="A+">A+</option>
                        <option value="B-">B-</option>
                        <option value="B+">B+</option>
                        <option value="AB">AB-</option>
                        <option value="AB+">AB+</option>
                    </select>

                </div>
                <br/>
                <div className="input">
                    <label className="header">Hair Color: </label>
                    <select className="custom-dropdown" id="hairDropdown" value={selectedHair} onChange={handleChange('selectedHair')}>
                        <option value="none">none</option>
                        <option value="Black">Black</option>
                        <option value="Brown">Brown</option>
                        <option value="Blonde">Blonde</option>
                        <option value="White/Grey">White/Grey</option>
                        <option value="Red">Red</option>
                    </select>

                    <label className="header">Eye Color:</label>
                    <select className='custom-dropdown' id="eyeDropdown" value={selectedEye} onChange={handleChange('selectedEye')}>
                        <option value='none'>none</option>
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
                <br/>
                <div className="input">
                    <label className="header">Maximum Age: {age} years</label>
                    <input
                        type="range"
                        className="custom-slider"
                        min="18"
                        max="100"
                        value={age}
                        onChange={handleAgeChange}
                    />

                    <label className='header'>Min Height (in):</label>
                    <select className='custom-dropdown-small' id="ftDropdown" value={selectedFt} onChange={handleChange('selectedFt')}>
                            <option value="1">1'</option>
                            <option value="2">2'</option>
                            <option value="3">3'</option>
                            <option value="4">4'</option>
                            <option value="5">5'</option>
                            <option value="6">6'</option>
                            <option value="7">7'</option>
                    </select>
                    <select className='custom-dropdown-small' id="inDropdown" value={selectedIn} onChange={handleChange('selectedIn')}>
                            <option value="1">1''</option>
                            <option value="2">2''</option>
                            <option value="3">3''</option>
                            <option value="4">4''</option>
                            <option value="5">5''</option>
                            <option value="6">6''</option>
                            <option value="7">7''</option>
                            <option value="8">8''</option>
                            <option value="9">9''</option>
                            <option value="10">10''</option>
                            <option value="11">11''</option>
                    </select>

                </div>
                <br/>
                <div className="input">
                    <label className="header">Education Level:</label>
                    <select className="custom-dropdown" id="educationDropdown" value={selectedEducation} onChange={handleChange('selectedEducation')}>
                        <option value="none">none</option>
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

                    <label className="header">Maximum Distance: {distance} miles</label>
                    <input
                        type="range"
                        className="custom-slider"
                        min="0"
                        max="100"
                        value={distance}
                        onChange={handleDistanceChange}
                    />

                </div>
            </form>
        </div>
    )
}

export default Preferences