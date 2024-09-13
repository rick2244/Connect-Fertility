const express = require('express');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken')
const pool = require('./db');
const router = express.Router();


/**
 * transportor that was created to allow me to send emails to other emails
 */
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS
    }}
)

/**
 * Verifies that the transporter works and is able to send emails from it
 */
transporter.verify((error, success) =>{
    if(error){
        console.log(error.message)
    }else{
        console.log('Ready for messages')
        console.log(success)
    }
})

/**
 * This checks whether the unique strings and if there is any error in the process the error is printed out
 * @param {*} {id, email, username} these are values that I need to send the Verification email
 * @param {*} res 
 */
const sendVerificationEmail = async ({id, email, username}, res) =>{
    const currentUrl = 'http://localhost:3001/auth/signup'
    console.log(`Entered sendVerificationEmail`)

    console.log(`Id: ${id}, Email: ${email}, Username: ${username}`)

    const uniqueString = uuidv4() + id

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Verify Your Email!",
        html: `<p>Verify your email address to complete the signup and login into your account.</p><p>This link <b>expires in 6 hours</b>.</p><p>Press <a href=${
            currentUrl + "/verify/" + id + "/" + uniqueString + '/' + email
          }>here</a> to proceed.</p>`,
    }

    const saltRounds = 10
    try{
        const hashedUniqueString = await bcrypt.hash(uniqueString, saltRounds)
        console.log('was able to bycrpyt hash')
        const newVerification = await pool.query(`INSERT INTO userverification (id, username, uniqueString, createdAt, expiresAt) VALUES($1, $2, $3, $4, $5) RETURNING *`, [id, username, hashedUniqueString, Date.now(), Date.now() + 21600000])
        console.log('populated the userverification table')
        try{
            await transporter.sendMail(mailOptions)
            console.log('Sent verification email successfully')
            //email send and verification record saved 
          
            console.log('made it past the json')
        }catch(error){
            console.log('send email error')
            console.log(error.message)
            res.json({
                status: "FAILED",
                message: 'Could not save verification email data!'
            })
        }
    }catch(error){
        res.json({
            status: "FAILED",
            message: 'An error occured while hashing email date'
        })
    }
}

/**
 * 
 * @param {*} {email, hashEmail} are values that I need to confirm whether I can send a link for someone to click
 * so that they are able to change the password of the account that theey want 
 * @param {*} res used in my console to print out messages to the user, usually an error message is sent in json format if there is an error
 */
const sendForgotPasswordEmail = async ({email, hasEmail}, res) =>{
    const currentUrl = 'http://localhost:3001'
    console.log(`Entered sendForgotPasswordEmail`)
    console.log(`Email: ${email}, hasEmail: ${hasEmail}`)

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Forgot Password",
        html: `<p>Your asked to reset your password. Click this link to change it.</p></p><p>Press <a href=${
            currentUrl + "/forget/"  + email
          }>here</a> to proceed.</p>`,
    }

    try{
        await transporter.sendMail(mailOptions)
        console.log('Sent verification email successfully')
        //email send and verification record saved 
        
        console.log('made it past the json')
    }catch(error){
        console.log('send email error')
        console.log(error.message)
        res.json({
            status: "FAILED",
            message: 'Could not save verification email data!'
        })
    }
}

/**
 * This method sends the username associated with the email that is connected to the user to their email
 * @param {*} email, the emai connected to the user
 * @param {*} res the respons sent 
 */
const sendUsernameEmail = async ({email}, res) =>{
    const currentUrl = 'http://localhost:3001'
    console.log(`Entered ForgotUsernameEmail`)
    console.log(`Email: ${email}`)

    const user = await pool.query(`SELECT * FROM todo_user_table WHERE email = $1`, [email])
    console.log(user.rows)
    const username = user.rows[0].user_name

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Username",
        html: `<p>The username connected to your account is ${username}.`,
    }

    try{
        await transporter.sendMail(mailOptions)
        console.log('Sent username email successfully')
        //email send and verification record saved 
        
    }catch(error){
        console.log('send email error')
        console.log(error.message)
        res.json({
            status: "FAILED",
            message: 'Could not save verification email data!'
        })
    }
}


/**
 * This is the link that changes the value change_passowr in the table to allow for
 * a person to change the password connected to a specific avcvount and it redirects to the signup page after
 * This is the link that is sent to the user to click in their email
 */
router.get('/forget/:email', async(req, res) =>{
    const {email} = req.params

    console.log('Trying to change window for Forgot functionality')

    try{
        const user = await pool.query(
            "UPDATE todo_user_table SET change_password = $1 WHERE email = $2",
            [true, email]
        );
        res.redirect(`http://localhost:3000`)
    }catch(error){
        let message = 'An error occured while checking for existing user verification record'
        console.log(message)
    }
})

/**
 * This link is what is sent to the the user to click on to verify their account so that they are able to log in
 */
router.get('/signup/verify/:id/:uniqueString/:email', async (req, res) =>{
    const {id, uniqueString, email} = req.params

    console.log('entered link related to email')
    try{
        const userVerification = await pool.query(`SELECT * FROM userverification WHERE id = $1`, [id])

        if(userVerification.rows.length >= 0){
            //user verifiation record exists
            const expiresAt = userVerification.rows[0].expiresat
            const hashedUniqueString = userVerification.rows[0].uniquestring
            const username  = userVerification.rows[0].username
            //checking if the link isn't expired
            if(expiresAt < Date.now()){
                try{
                    let titles = await pool.query(`SELECT * FROM ${username}`)
                    titles = titles.rows.map(names => names.title)
                    for (const title of titles){
                        console.log(title)
                        let val = await pool.query(`DELETE FROM ${title}` )
                    }
                    await pool.query(`DELETE FROM ${username}`)
                    await pool.query(`DELETE FROM todo_user_table where user_name = $1`, [username])
                    let message = 'Link has expired. Please sign up again.'
                    //there hasn't been a window created yet to display error
                    res.redirect(`/signup/verified/error=true&message=${message}`)

                }catch(error){
                    console.log(error.message)
                    let message = 'An error occured while clearing expired user verification record.'
                    res.redirect(`/signup/verified/error=true&message=${message}`)

                }
            }else{
                //valid record exists so we validate the user string
                //first we compare the hashed unique string

                try{
                    console.log('Made it to valid')
                    const result =  await bcrypt.compare(uniqueString, hashedUniqueString)
                    if (result) {
                        try{
                            await pool.query('UPDATE todo_user_table SET verified = $1 WHERE user_name = $2', [true, username])
                            await pool.query(`DELETE FROM userverification where id = $1`, [id])
                            res.redirect(`http://localhost:3000`)

                        }catch(error){
                            const message = 'An error occurred while finalizing successful verification'
                            console.log(message)
                        }

                    }else{
                        const message = 'Invalid verification details passed, check your inbox.'
                        console.log(message)
                    }
                
                }catch(error){
                    const message = 'An error occurred while comparing unique strings.'
                    console.log(message)
                }
            }
        }else{
            let message = 'Account record doesn\'t exist or has been verified already. Please sign up or login.'
            console.log(message)
        }     
    }catch(error){
        let message = 'An error occured while checking for existing user verification record'
        console.log(message)
    }
})

/**The handles a user signing up. The users info is added to a postgresSQL */
router.post('/signup', async (req, res) =>{
    try{
        let {email, username, password} = req.body;
        const usernameCheck = /^(?=.*[a-zA-Z])[a-zA-Z0-9]+$/
        const passwordCheck = /[^a-zA-Z0-9\s]/

        let table = 
        `CREATE TABLE IF NOT EXISTS todo_user_table (
            todo_id SERIAL PRIMARY KEY,
            user_name VARCHAR(255),
            password_hash VARCHAR(255),
            email VARCHAR(255),
            verified BOOLEAN DEFAULT FALSE,
            change_password BOOLEAN DEFAULT FALSE,
            form_filled BOOLEAN DEFAULT FALSE,
            name_of_user VARCHAR(255),
            classification VARCHAR(255),
            sex VARCHAR(255),
            day_dob INTEGER,
            month_dob INTEGER,
            year_dob INTEGER,
            age INTEGER,
            latitude DECIMAL(10, 6),
            longitude DECIMAL(10, 6),
            city VARCHAR(255),
            region VARCHAR(255),
            race VARCHAR(255),
            ethnicty VARCHAR(255),
            blood VARCHAR(255),
            hair VARCHAR(255),
            eye VARCHAR(255),
            education VARCHAR(255),
            occupation VARCHAR(255),
            marital_status VARCHAR(255),
            height_ft INTEGER,
            height_inches INTEGER,
            weight_lbs INTEGER,
            hobbies VARCHAR(255),
            bio VARCHAR(255),
            preference VARCHAR(255)
        );`

        await pool.query(table)
        //error handling in there is nothing entered before used hits submit
        if(email === null || username === null || password === null){
            return res.json({detail: 'Enter all the fields'})
        }

        if(!usernameCheck.test(username)){
            return res.json({detail: 'Username can contain digits and at least one letter'})
        }


        if(!passwordCheck.test(password)){
            return res.json({detail: 'Password must contain at least 1 special character'})
        }
        if(password.length < 8){
            return res.json({detail: 'Password must be at least 8 characters long'})
        }
        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(password, salt)

        const todos = await pool.query("SELECT * FROM todo_user_table")
        const hasUsername = todos.rows.some(users => users.user_name === username)
        const hasEmail = todos.rows.some(user => user.email === email)
        if(hasEmail){
            return res.json({detail : 'Email already exists'})
        }
        if (hasUsername){
            return res.json({detail : 'Username already exists'})
        }
        if (!hasEmail){
            verified = false;
            const newUser = await pool.query("INSERT INTO todo_user_table (user_name, password_hash, email) VALUES($1, $2, $3) RETURNING *", [username, hashPassword, email]);
            const user = await pool.query(`SELECT * FROM todo_user_table WHERE email = $1`, [email])
            const id = user.rows[0].todo_id
            const token = jwt.sign({email}, process.env.ACCESS_TOKEN, {expiresIn: '24hr'})
            const title = username;
            //turned off for now for testing of fake accounts
            //sendVerificationEmail({id,email, username}, res)
            const likes = 
            `CREATE TABLE IF NOT EXISTS ${title}_likes(
                id SERIAL PRIMARY KEY,
                user_name VARCHAR(255)
             );`
            const dislikes = 
            `CREATE TABLE IF NOT EXISTS ${title}_dislikes(
                id SERIAL PRIMARY KEY,
                user_name VARCHAR(255)
            );`
            const matches = 
            `CREATE TABLE IF NOT EXISTS ${title}_matches(
                id SERIAL PRIMARY KEY,
                user_name VARCHAR(255)
            );`
            const incoming_likes = 
            `CREATE TABLE IF NOT EXISTS ${title}_incoming_likes(
                id SERIAL PRIMARY KEY,
                user_name VARCHAR(255)
            );`

            await pool.query(likes);
            await pool.query(dislikes);
            await pool.query(matches)
            await pool.query(incoming_likes)
            res.json([true])
        }
    }catch(err){
        console.log(err.message)
        res.json({detail : `${err.message}`})
    }
})

/**
 * This is the link that handles the login process and checkes if a user exists that matches the info given
 * the login is allowed to hrouteren if the user's account is verified
 */
router.post('/login', async (req, res) =>{
    try{
        let {email_username, password} = req.body;

        if(email_username === null || password === null){
            return res.json({detail: 'Enter all the fields'})
        }
        const email = await pool.query('SELECT * FROM todo_user_table WHERE email = $1', [email_username]);
        const username = await pool.query('SELECT * FROM todo_user_table WHERE user_name = $1', [email_username])
        let user = []

        if(!email.rows.length && !username.rows.length){
            return res.json({detail : 'User does not exist'})
        }
        if(email.rows.length){
            user = email
        }
        if(username.rows.length){
            user = username
        }
        const verified = user.rows[0].verified

        const actual_email = user.rows[0].email
        const success = await bcrypt.compare(password, user.rows[0].password_hash)
        const token = jwt.sign({actual_email}, process.env.ACCESS_TOKEN, {expiresIn: '12hr'})

        if(success){
            if(verified){
                res.json({'email' : user.rows[0].email, 'username' : user.rows[0].user_name, token})
            }else{
                res.json({detail : 'Email isn\'t verified!'})
            }
        }else{
            res.json({detail : 'Login failed: incorrect password'})
        }
    }catch(err){
        res.json(err.message)
    }
})

/**
 * Utilized in client by ForgotPasswordEmail.js to get whether the email entered
 * exists or not. The return value of this link is either a true or flase in json format
 * and that is fetched in ForgotPasswordEmail.js
 */
router.get('/get_emails/:email/:forgotPassword', async (req, res) => {
    try{
        console.log('entered get_emails')
        let {email, forgotPassword} = req.params

        console.log(typeof forgotPassword)
        console.log(`Email: ${email}, ForgotPassword: ${forgotPassword}`)
        let todos = await pool.query("SELECT * FROM todo_user_table")
        const hasEmail = todos.rows.some(user => user.email === email)

        if(hasEmail && forgotPassword === 'true'){
            console.log('sending forgot email')
            sendForgotPasswordEmail({email, hasEmail}, res)
        }else if(hasEmail && forgotPassword === 'false'){
            console.log('sending username')
            sendUsernameEmail({email}, res)
        }
        res.json(hasEmail)
    }catch(error){
        console.log(error.message)
        res.json(error.message)
    }
})

/**
 * Returns the user's username, email, and name from the backend
 */
router.get('/get_username_email_name', async (req, res) =>{
    try{
        console.log('trying to get values needed for login')
        let {email_username} = req.query
        const value = new Map()

        console.log(email_username)

        const email = await pool.query('SELECT * FROM todo_user_table WHERE email = $1', [email_username]);
        const username = await pool.query('SELECT * FROM todo_user_table WHERE user_name = $1', [email_username])
        let user = []

        if(!email.rows.length && !username.rows.length){
            return res.json({detail : 'User does not exist'})
        }
        if(email.rows.length){
            user = email
        }
        if(username.rows.length){
            user = username
        }

        value.set('email', user.rows[0].email)
        value.set('username', user.rows[0].user_name)
        value.set('name', user.rows[0].name_of_user)

        const table = Object.fromEntries(value.entries());
        res.json(table)
    }catch(error){
        console.log(error.message)
    }
})

/**
 * Returns a boolean value that states whether the user has finished setting up thier profile
 */
router.get('/profile_completion', async (req, res) =>{
    try{
        let {email_username} = req.query

        const value = new Map()

        const email = await pool.query('SELECT * FROM todo_user_table WHERE email = $1', [email_username]);
        const username = await pool.query('SELECT * FROM todo_user_table WHERE user_name = $1', [email_username])
        let user = []

        if(email.rows.length){
            user = email
        }
        if(username.rows.length){
            user = username
        }

        const completed = user.rows[0].form_filled

        value.set('completed', completed)

        const table = Object.fromEntries(value.entries());
        res.json(table)
    }catch(error){
        console.log(error.message)
    }
})

/**
 * This link is utilized by ForgotPassword.js in client to change the password connect to the email account
 */
router.put('/updatepassword/:email/:password', async (req, res) =>{
    try{
        console.log('Trying to update password')
        const {email, password} = req.params
        console.log(`Passowrod change: ${password}`)

        let user_id = await pool.query(`SELECT * FROM todo_user_table where email = $1`, [email])
        console.log("made it to user_id")
        const changePassword = user_id.rows[0].change_password
        const passwordCheck = /[^a-zA-Z0-9\s]/
        if(!changePassword){
            console.log('Can not change')
            return res.json({detail : 'Link hasn\'t been clicked to approve the change of your password'})
        }
        if(!passwordCheck.test(password)){
            return res.json({detail: 'Password must contain at least 1 special character'})
        }
        if(password.length < 8){
            return res.json({detail: 'Password must be at least 8 characters long'})
        }
        const salt = bcrypt.genSaltSync(10)
        const hashPassword = bcrypt.hashSync(password, salt)
        console.log(`New Passowrd Hash: ${hashPassword}`)
        const user = await pool.query(
            "UPDATE todo_user_table SET change_password = $1, password_hash = $2 WHERE email = $3",
            [false, hashPassword,email]
        );
        console.log('succesful password change')
        res.json([true])
    }catch(error){
        console.log(error.message)
        res.json([false])
    }
})







module.exports = router
