const mongodb = require('mongodb')
const chalk = require('chalk')

const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

//Destructured Version of the above 2 lines

//const {MongoClient, ObjectID} = require('mongodb')

const connectionURL = process.env.MONGODB_URL
const databaseName = 'task-manager'

MongoClient.connect(connectionURL, { useNewUrlParser: true, 
useUnifiedTopology: true}, (error,client)=>{
    if(error)
    {
        return console.log(error)
    }
    else
        console.log('connected successfully')

        //Referencing a database and using it for further operations 
        //Note that if the database with the provided name is not available, mongodb creates one automatically 

        const db = client.db(databaseName)
        
        //Creating a collection in the database
        //Note if the collection with the provided name is not available, Mongodb creates one automatically 

        // db.collection('users').insertOne({
        //     name: 'Priyank',
        //     age: 22
        // })

        // db.collection('tasks').insertMany([
        //     {
        //         description: 'Task 1',
        //         completed: false
        //     },
        //     {
        //         description: 'Task 2',
        //         completed: true

        //     },
        //     {
        //         description: 'Task 3',
        //         completed: true
        //     }
        // ], (error, result)=>{
        //     if(error)
        //     {
        //         return console.log('Failed to enter the data')
        //     }
        //     else
        //     {
        //         return console.log(result.ops)
        //     }
        // })

    //    db.collection('tasks').find({completed:true}).count((error,count)=>{

    //              console.log(chalk.green(count))
    //    })

    //      db.collection('users').updateOne({
    //        _id: new ObjectID("5ee6f1ce264e32124c1380e5")
    //    }, {
    //        $set:{
    //            name: 'Ramanujan'
    //        }
    //    }).then((result)=>{
    //        console.log(result)
    //    }).catch((error)=>{
    //        console.log(error)
    //    })

    // db.collection('tasks').updateMany({
    //     completed: true
    // }, {
    //     $set:{
    //         completed: false
    //     }
    // }).then((result)=>{
    //     console.log('Update successful')
    // }).catch((error)=>{
    //     console.log(error)
    // })

    db.collection('tasks').deleteOne({
        completed:false
    }).then((result)=>{
            console.log("Deleted Data:" + result.deletedCount)
    }).catch((error)=>{
        console.log(error)
    })

})