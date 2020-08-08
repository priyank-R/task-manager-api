const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/task')
const mongoose = require('mongoose')
const {userOne, userOneId, userTwo, taskOne, populateDatase} = require('./fixtures/db')

beforeEach(async()=>{
    await populateDatase()
})

test('Should create a new task for the user', async()=>{
  const response =  await request(app)
        .post('/tasks')
        .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
        .send({
            description: `New sample task by ${userOne.name}`
        })
        .expect(200)
    
         const task = await Task.findById(response.body._id)
         expect(task).not.toBeNull()
         expect(task.completed).toEqual(false)
})

test('Should fetch all the tasks for userTwo', async()=>{
    const response = await request(app)
                    .get('/tasks?limit=5&skip=0&sortBy=createdAt:desc')
                    .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
                    .send()
                    .expect(200)
    expect(response.body.length).toEqual(2)
})

test('userTwo should not be able to delete first task by userOne',async()=>{

  
    await request(app)
          .delete(`/tasks/${taskOne._id}`)
          .set('Authorization',`Bearer ${userTwo.tokens[0].token}`)
          .send()
          .expect(404)
        
    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})