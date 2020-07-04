const express = require('express')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const auth = require('../middleware/auth')

const router = new express.Router()


//----------------Signing New User (Creating a new user account)------------------------
router.post('/users',async (req,res)=>{

    const user = new User(req.body)
    console.log(user)
    try{
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})
    }catch(e){
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
        console.log(error)
        res.status(401).send(error.message)
    }
})


//---------------------Logging Out------------------///
router.post('/users/logout',auth,async (req,res)=>{

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
router.post('/users/logoutAll',auth,async (req,res)=>{

    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).send()

    }catch(e){
        res.status(500).send(e.message)
    }
})

//----------------Getting the current user (Read Profile) -------------//
router.get('/users/me',auth,async(req,res)=>{
    try{
        
        res.send({user: req.user, token:req.token})
    }catch(e){
        res.send(e.message)

    }
})



//--------------Updating the profile of the authenticated user-----------//

router.patch('/users/me',auth,  async (req,res)=>{

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
router.delete('/users/me', auth, async(req, res)=>{
    try{
     await req.user.remove()
        
        res.send(req.user)

    }catch(e){
        res.status(500).send(e.message)
    }
})

module.exports = router