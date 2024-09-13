const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config()
const app = express();
const PORT = process.env.PORT
const bodyParser = require('body-parser');
const pool = require('./db');






app.use(bodyParser.json())
app.use(express.json())
app.use(cors({origin : true}))



const auth = require('./auth')

//uses urls that are associated with authtication and signing up or logining 
app.use('/auth', auth)

/**
 * Updates the individual tables for a user that keeps tracks of the usres that they have liked and disliked, or matched with
 * the users are added accordingly to where the belong based on the user action
 */
app.post('/update_likes_dislikes', async(req, res) =>{
    try{
        console.log('trying to update likes and dislikes')
        const {table, username, user} = req.query
        await pool.query(`INSERT INTO ${username}_${table} (user_name) VALUES($1)`, [user])

        if(table === 'likes'){
            const userLikes = await pool.query(`SELECT * FROM ${user}_likes`)
            const hasUsername = userLikes.rows.some(userLikes => userLikes.user_name === username)
            if(hasUsername){
                await pool.query(`INSERT INTO ${username}_matches (user_name) VALUES($1)`, [user])
                await pool.query(`INSERT INTO ${user}_matches (user_name) VALUES($1)`, [username])
                return res.json(true)
            }else{
                await pool.query(`INSERT INTO ${user}_incoming_likes (user_name) VALUES($1)`, [username])
            }
        }
        console
        res.json(false)
    }catch(error){
        console.log(error)
    }
})

/** users are added to the classification table that they choose to identify as */
app.post('/update_tables', async(req, res) =>{
    try{
        const {table, username} = req.query
        console.log(table)
        await pool.query(`INSERT INTO ${table} (user_name) VALUES ($1)`, [username]);
        res.json([true])
    }catch(error){
        console.log(error)
    }
})

/**
 * Calculate the distance between two users
 * @param {*} lat1 latitude of user 1
 * @param {*} lon1 longitude of user 1
 * @param {*} lat2 latitude of user 2
 * @param {*} lon2 longitude of use 2
 * @returns the miles away users are to each other
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 3963.2; // Radius of the Earth in miles
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
}

function deg2rad(deg) {
    return deg * (Math.PI/180);
}
/**
 * This link returns data related to an individual user in json format if they exist and an error other wise
 */
app.get('/get_users', async (req, res) =>{
    try{
        console.log('attempting to get users')
        let {table, sex, race, blood, hair, eye, education, distance, latitude, longitude, age, ft, inches} = req.query

        distance = parseInt(distance)
        latitude = parseFloat(latitude)
        longitude = parseFloat(longitude)
        age = parseInt(age)
        ft = parseInt(ft)
        inches = parseInt(inches)

        console.log(`race: ${race}`)
        const user = await pool.query(
            `SELECT user_name FROM ${table}`
        )

        console.log(table)
        let usernames = user.rows.map(row => row.user_name)

        //filter by distance age, and height
        matches = []
        
        for (const item of usernames) {
            console.log(`Item: ${item}`);
            const user = await pool.query(`SELECT * FROM todo_user_table WHERE user_name = $1`, [item]);
            const user_latitude = parseFloat(user.rows[0].latitude);
            const user_longitude = parseFloat(user.rows[0].longitude);
            const miles = calculateDistance(latitude, longitude, user_latitude, user_longitude);
            if (miles <= distance && user.rows[0].age <= age && user.rows[0].height_ft >= ft && user.rows[0].height_inches >= inches) {
                console.log(`Adding user: ${item}`);
                matches.push(item);
            } else {
                console.log(`Not adding user: ${item}`);
            }
        }

        usernames = matches
        console.log('after checking for distance, age, and height')
        console.log(usernames)
        console.log('after printing array')

        if(usernames.length === 0){
            return res.json(usernames)
        }

        if(sex !== 'none'){
            const sexs = await pool.query(`SELECT user_name FROM todo_user_table WHERE sex = $1`, [sex])
            const sex_usernames = sexs.rows.map(row => row.user_name)
            console.log(sex_usernames)
            usernames = usernames.filter(username => sex_usernames.includes(username))
        }
        if(race !== 'none'){
            const races = await pool.query(`SELECT user_name FROM todo_user_table WHERE race = $1`, [race])
            const race_usernames = races.rows.map(row => row.user_name)
            usernames = usernames.filter(username => race_usernames.includes(username))
        }
        if(blood !== 'none'){
            const bloods = await pool.query(`SELECT user_name FROM todo_user_table WHERE blood = $1`, [blood])
            const blood_usernames = bloods.rows.map(row => row.user_name)
            usernames = usernames.filter(username => blood_usernames_usernames.includes(username))
        }
        if(hair !== 'none'){
            const hairs = await pool.query(`SELECT user_name FROM todo_user_table WHERE hair = $1`, [hair])
            const hair_usernames = hairs.rows.map(row => row.user_name)
            usernames = usernames.filter(username => hair_usernames.includes(username))
        }
        if(eye !== 'none'){
            const eyes = await pool.query(`SELECT user_name FROM todo_user_table WHERE eye = $1`, [eye])
            const eye_usernames = eyes.rows.map(row => row.user_name)
            usernames = usernames.filter(username => eye_usernames.includes(username))
        }
        if(education !== 'none'){
            const educations = await pool.query(`SELECT user_name FROM todo_user_table WHERE education = $1`, [education])
            const education_usernames = educations.rows.map(row => row.user_name)
            usernames = usernames.filter(username => education_usernames.includes(username))
        }

        console.log(usernames)

        console.log(`returning something`)
        res.json(usernames);
    }catch(error){
        console.log(error.message)
        res.json(error.message)
    }

})

/**
 * This will return the binary data of the imgaes so that I can display it on my website
 */
app.get('/get_images', async (req, res) => {
    try{
        const {username} = req.query
    
        const folderName = username;

        const response = await fetch(`https://api.cloudinary.com/v1_1/${process.env.CLOUD}/resources/image?prefix=${folderName}&type=upload`,{
            headers: {
                Authorization: `Basic ${Buffer.from(process.env.API_KEY + ':' + process.env.SECRET_API_KEY).toString('base64')}`
            }
        })
        
        const data = await response.json();
        res.json(data);
    }catch(error){
        console.log(error.message)
    }
})

/**
 * Returns a list of the users that have already liked the users profile
 * and that the user hasn't swiped left or right on
 */
app.get('/get_users_actions/:table', async(req, res) =>{
    try{
        let {table} = req.params
        const {username} = req.query

        if(table === 'incoming'){
            table = 'incoming_likes'
        }

        let users = await pool.query(
            `SELECT user_name FROM ${username}_${table}`
        )

        users = users.rows.map(row => row.user_name)
        console.log(users)
        res.json(users)
    }catch(error){
        console.log(error.message)
    }
})

/**
 * Returns a list of the users that the user has already matched with
 */
app.get('/get_matches', async(req, res) =>{
    try{
        console.log('trying to get user matches')
        const {username} = req.query
        console.log(username)
        let users = await pool.query(
            `SELECT user_name FROM ${username}_matches`
        )

        users = users.rows.map(row => row.user_name)
      
        res.json(users)
    }catch(error){
        console.log(error.message)
    }
})

/**
 * Gets relevent info related to the a user
 */
app.get('/get_info', async (req, res) =>{
    try{
        console.log('Getting info')
        const value = new Map()
        const {username} = req.query

        let user_id = await pool.query(`SELECT * FROM todo_user_table where user_name = $1`, [username])

        
        value.set('age', user_id.rows[0].age)
        value.set('username', user_id.rows[0].user_name)
        value.set('name', user_id.rows[0].name_of_user)
        value.set('city', user_id.rows[0].city)
        value.set('region', user_id.rows[0].region)
        value.set('blood', user_id.rows[0].blood)
        value.set('hair', user_id.rows[0].hair)
        value.set('eye', user_id.rows[0].eye)
        value.set('education', user_id.rows[0].education)
        value.set('ethnicity', user_id.rows[0].ethnicty)
        value.set('occupation', user_id.rows[0].occupation)
        value.set('marital', user_id.rows[0].marital_status)
        value.set('ft', user_id.rows[0].height_ft)
        value.set('inches', user_id.rows[0].height_inches)
        value.set('weight', user_id.rows[0].weight_lbs)
        value.set('hobbies', user_id.rows[0].hobbies)
        value.set('bio', user_id.rows[0].bio)
        value.set('sex', user_id.rows[0].sex)
        value.set('classification', user_id.rows[0].classification)
        value.set('preference', user_id.rows[0].preference)
        value.set('longitude', user_id.rows[0].longitude)
        value.set('latitude', user_id.rows[0].latitude)

        console.log(value)
        const table = Object.fromEntries(value.entries());
        res.json(table)
    }catch(error){
        console.log(error.message)
    }
})

/**
 * Adds the data that is entered in for registration into the main PostgresSQL holding user data
 */
app.put(`/profile_start/:name/:day/:month/:year/:age/:latitude/:longitude/:city/:region/:race/:ethnicity/:blood/:hair/:eye/:education/:occupation/:marital/:ft/:inches/:lbs/:hobbies/:bio/:sex/:classification/:preference/:username`, async (req, res) =>{
    try{
        console.log('Trying to update values from form.')
        const {name, day, month, year, age, latitude, longitude, city,
            region, race, ethnicity, blood, hair, eye, education, occupation, marital,
            ft, inches, lbs, hobbies, bio, sex, classification, preference, username
        } = req.params
    
        const update = await pool.query(`UPDATE todo_user_table SET name_of_user = $1, day_dob = $2, month_dob = $3,
        year_dob = $4, age = $5, latitude = $6, longitude = $7, city = $8, region = $9,
        race = $10, blood = $11, hair = $12, eye = $13, education = $14, occupation = $15,
        marital_status = $16, height_ft = $17, height_inches = $18, weight_lbs = $19, hobbies = $20,
        bio = $21, ethnicty = $22, sex = $23, classification = $24, preference = $25 WHERE user_name = $26`, [name, day, month, year, age, latitude, longitude, city,
            region, race, blood, hair, eye, education, occupation, marital,
            ft, inches, lbs, hobbies, bio, ethnicity, sex, classification, preference, username])
        res.json([true])

    }catch(error){
        console.log(error.message)
        res.json([false])
    }
})

/**
 * Updates the value in the main user table that keeps track of whether a usre has finished registering to true
 */
app.put('/form_filled', async(req, res) =>{
    try{
        const {username} = req.query

        await pool.query('UPDATE todo_user_table SET form_filled = $1 WHERE user_name = $2', [true, username])
        res.json([true])
    }catch(error){

    }
})

/**
 * This allows for changes to occur with changes without me ahving to manually run node after 
 * each change since it is listing to changes
 */
app.listen(PORT, () => {
    console.log(`Listening to http://localhost:${PORT}`)
})