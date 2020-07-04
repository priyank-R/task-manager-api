const Task = require('../models/task')
const express = require('express')
const auth = require('../middleware/auth')
const router = new express.Router()

router.patch('/tasks/:id', auth, async (req,res)=>{
    let allowedUpdates = ["description","completed"]
    let updates = Object.keys(req.body)
    let isValidOperation = updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Not a valid update parameter'})
    }
    try{
        const task = await Task.findOne({_id:req.params.id,owner:req.user._id})
       // const task = await Task.findById(req.params.id)
 
       // const task = await Task.findByIdAndUpdate(req.params.id,req.body,{new: true,runValidators: true})
        if(!task){
            return res.status(404).send('Given task not found')
        }
        updates.forEach((update)=>task[update]=req.body[update])
        await task.save()
        res.send('New task: ' + task)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/tasks',auth, async (req,res)=>{
    try{
    //const task = await Task.find({owner:req.user._id})
    //ALTERNATIVE for the above line 
    await req.user.populate('tasks_virtual').execPopulate()
    res.send(req.user.tasks_virtual)
    }catch (e){
     res.status(500).send(e)   
    }


    // Task.find({}).then((tasks)=>{
    //     res.send(tasks)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

router.get('/tasks/:id',auth, async (req,res)=>{
    let _id = req.params.id
    try{
        
        //const task = await Task.findById(_id)
        const task = await Task.findOne({_id, owner:req.user._id})

        if(!task){
            return res.status(404).send('Task not found')
        }
        res.status(200).send(task)
        
    }catch(e){
        res.status(500).send(e)
    }
    // Task.findById(_id).then((task)=>{
    //     if(!task){
    //         res.status(404).send('Task not found')
    //     }
    //     res.status(200).send(task)
    // }).catch((e)=>{
    //     res.status(500).send(e)
    // })
})

//--Creating a new task after authenticating the user ---------//
router.post('/tasks', auth, async (req,res)=>{

    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try{
        await task.save()
        res.send(task)
    }catch(e){
        res.status(400).send(e)
    }
    // task.save().then(()=>{
    //     res.send(req.body)
    // }).catch((error)=>{
    //     res.status(400).send(error)
    // })

})

router.delete('/tasks/:id', auth, async(req, res)=>{
    try{
        //let deletedTask = await Task.findByIdAndDelete(req.params.id)
        const deleteTask = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!deleteTask){
            return res.status(404).send({error: "Given ID not found"})
        }
        res.send(deleteTask)

    }catch(e){
        res.status(500).send(e.message)
    }
})

module.exports = router