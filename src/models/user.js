const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Task = require('./task')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        validate(value){
            if(value<0){
                throw new Error('Age must be a positive number')
            }
        },
        required: true
    },
    email : {
        type: String,
        trim: true,
        unique:true,
        required:true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Enter a valid email')
            }
        }
    },
    password: {
        type: String, 
        required: true,
        validate(value){
            if(value.length < 6)
            {
                throw new Error('Password must be atleast 6 characters long')
            }
            else if((/^password$/i).test(value)){
                throw new Error('Password must not be \'Password\'')

            }
        }
    },

    tokens: [{ 
        token: {
            type: String,
            required: true
        }
    }],
    avatar:{
        type:Buffer
    }
    
}, {
    timestamps: true
})


//Setting up a virtual property to virtually assign all tasks of user to the user
userSchema.virtual('tasks_virtual',{
    ref: 'Tasks',
    localField: '_id',
    foreignField: 'owner'
})

//-----------Adding a new method accessible by User-Model
userSchema.statics.findByCredentials = async(email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error("Incorrect Login Details")
    }
    let isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error("Incorrect login details")
    }
    return user
}

//Adding generateAuthToke() accessible by user instance
userSchema.methods.generateAuthToken = async function(){
   // console.log(user)
   const user = this
    const token = jwt.sign({_id: user._id.toString() },'mysecretkey')

    user.tokens.push({token})
    await user.save()
    return token
     

}

//Using toJSON() method to hide the sensitive data when returning the user object in the response
userSchema.methods.toJSON =  function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar

    return userObject
}


//Function to HASH the password before saving 
userSchema.pre('save',async function(next){

    //some code to convert password string to hash string
    if(this.isModified('password')){
    this.password = await bcrypt.hash(this.password,8)
    }

    next()
})

userSchema.pre('remove', async function(next){

        const user = this
       console.log(await Task.deleteMany({owner:user._id}))
        next()
})


const User = mongoose.model('User',userSchema)

module.exports = User