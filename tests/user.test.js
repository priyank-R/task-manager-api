const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')

const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')



//Creating a mock user for testing
const userOneId = new mongoose.Types.ObjectId()
const userOne = new User({
    _id: userOneId,
    name: 'Temp-user',
    email: 'tempuser@gmail.com',
    password: 'tempuser',
    age:40,
    tokens: [{
        token: jwt.sign({_id:userOneId},process.env.JWT_SECRET)
    }]
})

beforeEach(async()=>{
    await User.deleteMany()
   await userOne.save()
    
})


test('Should sign up a new user', async()=>{
    await request(app).post('/users').send({
        name:'priyank',
        email:'xyz@gmail.com',
        password:'xyz@gmail.com',
        age:33
    }).expect(201)
})

test('Should not login non-existent user', async()=>{
    await request(app).post('/users/login').send({
        email:'nonexistentuser@gmail.com',
        password:'nonexistentuser'
    }).expect(401)
})

test('Should read the profile of the logged in user', async()=>{
    await request(app)
         .get('/users/me')
         .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
         .send()
         .expect(200)
})