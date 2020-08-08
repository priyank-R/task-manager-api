const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOneId, userOne, populateDatase} = require('./fixtures/db')

beforeEach(async()=>{
    await populateDatase()
})


test('Should sign up a new user', async()=>{
    const response = await request(app).post('/users').send({
        name:'priyank',
        email:'xyz@gmail.com',
        password:'xyz@gmail.com',
        age:33
    }).expect(201)

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    console.log(response.body)
    //Assertions about the Response body
    expect(response.body).toMatchObject({
        user:{
            name: 'priyank',
            email:'xyz@gmail.com',
            age:33
        },
        token:user.tokens[0].token
    })

    expect(user.password).not.toBe('tempuser')
    
})


test('Should login the existing user',async()=>{
    const response = await request(app)
    .post('/users/login')
    .send({
        email: 'tempuser@gmail.com',
        password: 'tempuser'
    })
    .expect(200)

    const user = await User.findById(response.body.user._id)
    expect(response.body.token).toBe(user.tokens[1].token)
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

test('Should not get profile for unauthenticated user', async()=>{
    await request(app)
           .get('/users/me')
           .send()
           .expect(401) 
})

test('Should delete the account of the authenticated user', async()=>{
    await request(app)
          .delete('/users/me')
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .send()
          .expect(200)

    //Null assertion after the user is deleted from the database
    const user = await User.findById(userOneId) 
    console.log(user)
    expect(user).toBeNull()

    
})

test('Should not delete the account of unauthenticated user',async()=>{
    await request(app)
          .delete('/users/me')
          .send()
          .expect(401)

})

test('should upload the avatar image', async()=>{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .attach('avatar-pic','tests/fixtures/profile-pic.jpg')
        .expect(200)

    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async()=>{
    await request(app)
          .patch('/users/me')
          .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
          .send({
              name: 'new-name'
          })
          .expect(200)

          const user = await User.findById(userOneId)
          //console.log(user)
          expect(user.name).toBe('new-name')
})

test('Should not update invalid user fields', async()=>{
    await request(app)
          .patch('/users/me')
          .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
          .send({
              location: 'uae'
          })
          .expect(400)

})