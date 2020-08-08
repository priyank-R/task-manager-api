const mongoose = require('mongoose')
const jwt = require('jsonwebtoken')
const User = require('../../src/models/user')
const Task = require('../../src/models/task')


//Creating a mock user for testing
const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Temp-user',
    email: 'tempuser@gmail.com',
    password: 'tempuser',
    age:40,
    tokens: [{
        token: jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
}

//Creating a Mock task for User One

const taskOne ={
    _id:new mongoose.Types.ObjectId(),
    description: 'This is taskOne for userOne',
    completed:true,
    owner:userOneId
}
//Creating a mock user for testing
const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Temp2',
    email: 'temp2user@gmail.com',
    password: 'tempuser2',
    age:70,
    tokens: [{
        token: jwt.sign({_id:userTwoId},process.env.JWT_SECRET)
    }]
}

//Creating a Mock task for User Two

const taskTwo ={
    _id:new mongoose.Types.ObjectId(),
    description: 'This is taskTwo for userTwo',
    completed:false,
    owner:userTwoId
}

const taskThree ={
    _id:new mongoose.Types.ObjectId(),
    description: 'This is taskThree for userTwo',
    completed:true,
    owner:userTwoId
}
   

const populateDatase = async()=>{
    try{
        await User.deleteMany()
        await Task.deleteMany()

        await new User(userOne).save()
        await new User(userTwo).save()

        await new Task(taskOne).save()
        await new Task(taskTwo).save()
        await new Task(taskThree).save()
        }catch(e){
            console.log('BeforeEach error: ',e)
        }
}

module.exports = {
    userOneId,
    userOne,
    userTwo,
    taskOne,
    populateDatase
}

