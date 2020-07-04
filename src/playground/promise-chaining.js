require('../db/mongoose')
const task = require('../models/task')

//removing a given task by ID

// task.findByIdAndDelete('5eec34f926f0f60f0bd29aeb').then((task_1)=>{
//     console.log('The removed task is: '+task_1)
//     return task.countDocuments({completed: false})
// }).then((count)=>{
//     console.log('incomplete tasks: '+count)
// }).catch((e)=>{
//     console.log(e)
// })

const deleteTaskandCount = async (id)=>{

const deltedTask = await task.findByIdAndDelete(id)
const count = await task.countDocuments()
return console.log(count) 
}

deleteTaskandCount('5eec34f926f0f60f0bd29aeb').then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})
