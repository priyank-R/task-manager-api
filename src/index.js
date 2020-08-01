const app = require('./app')

//Defining the Port 
const port = process.env.PORT

//Making the server listen on the port 
app.listen(port, ()=>{
    console.log('Listening on port '+ port)
})





