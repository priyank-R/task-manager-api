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
const multer = require('multer')
const upload = multer({ dest: 'images/'})



app.post('/upload',upload.single('upload'),(req,res)=>{
    res.send('Upload Req Successful')
})


app.use(express.json())

//Using the routes 
app.use(userRoute)
app.use(taskRoute)




//Making the server listen on the port 
app.listen(port, ()=>{
    console.log('Listening on port '+ port)
})





