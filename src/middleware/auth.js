const jwt = require('jsonwebtoken')
const User = require('../models/user')

const auth = async(req,res,next)=>{
    try{
    //Extracting the token value from the request sent by the user
    
    const token = req.header('Authorization').replace('Bearer ','')
    
    //Verifying the JWT with the secretkey
    const decoded =  jwt.verify(token, 'mysecretkey')

    

    //Finding the user from the provided ID in the token body 
    const user = await User.findOne({_id:decoded._id, 'tokens.token':token })

    if(!user){
        throw new Error()
    }
    req.token = token
    req.user = user
    next()
    }catch(e){
        res.status(401).send({e:"Unauthorized"})
    }


  
}

module.exports = auth