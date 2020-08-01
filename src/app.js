const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Task = require('./models/task')

//Requiring the Router
const userRoute = require('./routes/userRoute')
const taskRoute = require('./routes/taskRoute')


//Intialising server 
const app = express()

app.use(express.json())
app.use(userRoute)
app.use(taskRoute)




module.exports = app





