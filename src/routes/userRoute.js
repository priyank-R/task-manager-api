const express = require('express')
const multer = require('multer')    //file-upload
const sharp = require('sharp')      //handling-images
const User = require('../models/user')
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth')

const { sendWelcomeMail, sendCancelEmail } = require('../emails/account')

const passport = require('passport')
require('../config/passport')(passport)


const router = new express.Router()


//----------------Signing New User (Creating a new user account)------------------------
router.post('/users',async (req,res)=>{

    const user = new User(req.body)
    console.log(req.body)
    const {body:{name,age,email}} = req
    //console.log(body)
  //  console.log(user)
    try{
        await user.save()
      //  sendWelcomeMail(user.email,user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
        console.log(e)
        res.status(400).send(e)
    }
})


//-------------------Logging in ---------------------------------
router.post('/users/login',async (req,res)=>{
    
    try{
        const user = await User.findByCredentials(req.body.email,req.body.password)

        const token = await user.generateAuthToken()
        
        res.status(200).send({user, token})

    }catch(error){
        console.log("Login-Error: ", error)
        res.status(401).send()
    }
})


//---------------------Logging Out------------------///
router.post('/users/logout',passport.authenticate('jwt',{session:false}),async (req,res)=>{

    console.log(req.token)

    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token     //Returns false if token.token == req.token and hence, the required token object is removed
        })
        await req.user.save()
        res.send("Logged out from current session")

    }catch(e){
        res.status(500).send()
    }
})


//---------------------Logout ALL Sessions -------------------------//
router.post('/users/logoutAll',passport.authenticate('jwt',{session:false}),async (req,res)=>{

    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()

    }catch(e){
        res.status(500).send(e.message)
    }
})

//----------------Getting the current user (Read Profile) -------------//
// router.get('/users/me',auth,async(req,res)=>{
//     try{
        
//         res.send({user: req.user, token:req.token})
//     }catch(e){
//         res.send(e.message)

//     }
// })

//--Uploading the profile picture of the user --//

const avatar = multer({
   
    limits :{
        fileSize: 1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error("Please upload an image",false))
        }
         cb(undefined,true)
    }

})
router.post('/users/me/avatar',auth,avatar.single('avatar-pic'),async (req,res)=>{
   
    const buffer = await sharp(req.file.buffer).resize(width=250,height=250).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.send()

},(error,req,res,next)=>{//This is the predefined function signature to catch all the errors that the middleware throws.

    res.status(400).send({error:error.message})
})



//--Deleting the user Avatar using DELETE Method --//

router.delete('/users/me/avatar',auth, async (req,res)=>{

    req.user.avatar = undefined
    await req.user.save()
    res.send()
})

//--Fetching the avatar of the user and rendering it in the reponse object 
 router.get('/users/:id/avatar',async (req,res)=>{
     try{

         const user = await User.findById((req.params.id))

         if(!user || !user.avatar){
             throw new Error()
         }

         res.set('Content-Type', 'image/png')
         res.send(user.avatar)

     }catch(e){
        res.status(404).send()
     }
 })






//Getting the current user with PASSPORT MIDDLEWRE (Read Profile)
router.get('/users/me',passport.authenticate('jwt',{session:false}),async(req,res)=>{
    try{
        console.log(req.user)
        res.send({user: req.user, token:req.token})
    }catch(e){
        res.send(e.message)

    }
})




//--------------Updating the profile of the authenticated user-----------//

router.patch('/users/me', passport.authenticate('jwt',{session:false}), async (req,res)=>{

    //Store Id in a variable
    let id = req.user._id

    //Creating the validation array to store the properties that are allowed to be modified 
    let allowedUpdates = ["name","age", "email","password"]

  
    let updates = Object.keys(req.body) //Fetches the properties mentioned in the request body for the update
    //comparing the set of requested properties to update with the predefined set of updates
    // updates.every will compare each requested property with the array of allowedUpdates - If it'd find even one of the property to be not in the array,
    //it would return false and isValidOperation would become false 
    let isValidOperation =  updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation)
    {
        return res.status(400).send({error: "Not a valid update parameter"})
    }

 


    //Call for the method findByIdAndUpdate
    //Using a try block to catch the errors encountered 

    try{
        let passwordFlag = false
      //  const user = await User.findById(id)
        updates.forEach((update)=>{
            if(update==="password"){
                passwordFlag = true
            }
            req.user[update]=req.body[update]
        })
        await req.user.save()
        if(passwordFlag===true) //Logs out if the password is updated by the user 
        {
            req.user.tokens = req.user.tokens.filter((token)=>{
                return token.token !== req.token     //Returns false if token.token == req.token and hence, the required token object is removed
            })
            await req.user.save()
            res.send("Logged out from current session")
        }

        res.send(req.user)

    }catch(e){
        res.status(400).send({e})
    }


})



//-----------------Deleting The Authenticated User from the system
router.delete('/users/me', passport.authenticate('jwt',{session:false}), async(req, res)=>{
    try{
     await req.user.remove()
     sendCancelEmail(req.user.email, req.user.name)

        
        res.send(req.user)

    }catch(e){
        res.status(500).send(e.message)
    }
})

module.exports = router