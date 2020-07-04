const add = (a,b)=>{
    return new Promise((res,rej)=>{
        console.log('hello')
        resolve(a+b)
    })
}

const doWork = async ()=>{
    var sum = await add(1,2)
    
}