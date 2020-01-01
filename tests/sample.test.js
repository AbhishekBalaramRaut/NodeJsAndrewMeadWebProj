const {add,farenheitToCelcius,celciusToFarenheit} = require('./sample');

test('number is fine', async () => {
    const sum = await add(2,3)
    expect(sum).toBe(5);
});

test('need positive number', async () => {
    const sum = await add(1,3)
    expect(sum).toBe(4);
});

test('farenheitToCelcius',  () => {
    const temp =  farenheitToCelcius(0)
    expect(temp).toBe(32);
});

test('celciusToFarenheit',  () => {
    const temp =  celciusToFarenheit(32)
    expect(temp).toBe(0);
});