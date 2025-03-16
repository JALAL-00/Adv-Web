//The reduce() method executes a reducer function on each element of the array, resulting in a single output value.

/* A reducer function typically looks like this:
function reducer(accumulator, currentValue, index, array) {
    // Logic to update the accumulator
    return updatedAccumulator;
} */

const numbers = [1, 2, 3, 4];
const sum = numbers.reduce((acc, curr) => acc + curr, 0);

console.log(sum); // Output: 10


/*
// Practical Example: Shopping Cart Total
const cart = [
    { name: "Apple", price: 1.5, quantity: 2 },
    { name: "Banana", price: 0.5, quantity: 4 },
    { name: "Orange", price: 2, quantity: 1 }
];

const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

console.log(total); // Output: 7 (1.5*2 + 0.5*4 + 2*1)

*/