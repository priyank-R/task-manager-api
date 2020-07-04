const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient
const ObjectID = mongodb.ObjectID

const connectURL = 'mongodb://127.0.0.1:27017'
const databaseName = 'task-manager-api'

const client = MongoClient.connect(connectURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (error,client)=>{
    if(error)
    {
        return console.log(error)
    }

    const db = client.db(databaseName)
    db.collection('tasks').updateOne({
        _id: new  ObjectID("5eeb004a753d7c14d3db2b9f")
       
    }, {
        $set: {
            completed: true
        }
    }).then((result)=>{
    console.log('success')
}).catch((error)=>{
    console.log('fail')
})

})

// client.then((client)=>{
//     const db = client.db(databaseName)
//     db.collection('tasks').updateOne({
//         _id: new ObjectId("5eeb004a753d7c14d3db2b9f")
//     }, {
//         $set:{
//             description: 'Uma shankar security fix'
//         }
//     }).then((result)=>{
//         return console.log('Successful')
//     }).catch((error)=>{
//         return console.log(error)
//     })
// }).catch((error)=>{
//     return console.log(error)
// })