const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

//Requiring the Router
const userRoute = require('./routes/userRoute')
const taskRoute = require('./routes/taskRoute')


//Intialising server 
const app = express()



//Defining the Port 
const port = process.env.PORT || 3000

// app.use((req,res,next)=>{

//     res.status(503).send("Website under maintenance")
// })

app.use(express.json())

//Using the routes 
app.use(userRoute)
app.use(taskRoute)


//Making the server listen on the port 
app.listen(port, ()=>{
    console.log('Listening on port '+ port)
})

// const jwt = require('jsonwebtoken')
// const function1 = async ()=>{
// const token =  await jwt.sign({_id:"abc123"}, "mysignature", {expiresIn:"10 second"})
// console.log(token)
// console.log(await jwt.verify(token,'mysignature'))
// }

// function1()



// const temp = async ()=>{
//     // let task = await Task.findById('5efd8eac772e192b82d54b85')
//     //     await task.populate('owner').execPopulate()
//     //     console.log(task.owner)

//     const user = await User.findById('5efd5ebd9e6e262500ea7194')
//     await user.populate('tasks_virtual').execPopulate()
//     console.log(user.tasks_virtual)
// }
// temp()



