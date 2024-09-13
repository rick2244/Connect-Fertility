# connect-fertility-API
Running Server: npm run dev
Running Client: npm run start

Bugs and possible glitches:
1. There is a bug when the user fills out info for their profile that causes an error, and the form isn't submitted.
It is usually fixable: refresh. For some reason, the API calls to the Google Firestore database are sometimes randomly rejected and need to be refreshed.

2. The changed password doesn't work right now because of the addition of the Google Fire Store database. I know how to change the password when it comes to the PostgreSQL
   I struggled to figure out how to change it on the Google Firestore base and keep track of users.
   
3. The swiping functionality starts working after a user reaches Preferences and hits the change preferences once. This is because I didn't have enough time and
   I had to use localStorage instead of an external database to keep track of the user filters. Due to that not being the form of implementation, user preferences are not saved, so they need to be changed each time a person logs in.
   
5. There could be a potential issue with how chats are added in the chat window. Currently, chats are made available between users when they match.
   The option to delete an account has yet to be added, so there wasn't a chance to debug and make it work smoothly so that chats are deleted when the users no longer exist.

Changes need to be made to run on a different laptop:
1. prominent changes need to be made, like creating a PostgreSQL account; there is code that creates all the necessary tables in the code.
2. For Cloudinary, the person has to create an account and fill out their API key for the Cloudinary account
3. Similar to Google Firestore, the person has to create their account and plug in the relevant information for their account
4. Nodemailer must also be configured for each person trying to run it. There needs to be an email provided and a key to permit the person to use the email to send verification emails 

   
