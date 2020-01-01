const add = (a,b) => {
    return new Promise((resolve,reject) => {
         setTimeout(() => {
            console.log('a,b '+a+','+b);

            if(a<1) {
                reject({message: 'Need positive number'});
            }
            resolve(a+b);
         },2000);
    });
}

const farenheitToCelcius = (temp) => {
    return (temp * 1.8) + 32;
}

const celciusToFarenheit = (temp) => {
    return (temp-32) / 1.8;
}
module.exports = {
    add,
    farenheitToCelcius,
    celciusToFarenheit
}