const { calculateTip, celsiusToFahrenheit, fahrenheitToCelsius } = require('../math')

test('Calculate the total with tip',()=>{

    const total = calculateTip(10, .3)
    expect(total).toBe(13)
})

test('calculate the total with default tip (.25) ', ()=>{
    const total = calculateTip(10)
    expect(total).toBe(12.5)
})

test('Should convert 32F to 0 C', ()=>{
    const convert = fahrenheitToCelsius(32)
    expect(convert).toBe(0)
})

test('Should convert 0C to 32F',()=>{
    const convert = celsiusToFahrenheit(0)
    expect(convert).toBe(32)
})

// test('Async function demo',(done)=>{
//     setTimeout(()=>{
//         expect(1).toBe(2)
//         done()
//     },2000)
// })