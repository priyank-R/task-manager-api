const mongoose = require('mongoose')
const validator = require('validator')

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
    useNewUrlParser:true,
    useCreateIndex:true
})


// const me = new User({
//     name: 'Jay',
//     age: 24,
//     email: 'jayxyz@gmail.com',
//     password: 'xyz@1234'
// })

// me.save().then(()=>{
//     console.log(me)
// }).catch((error)=>{
//     console.log(error)
// })


