//The map() method creates a new array by applying a function to each element of the original array. It does not modify the original array.

const numbers = [1, 2, 3];
const squaredNumbers = numbers.map(num => num * num);

console.log(squaredNumbers); // Output: [1, 4, 9]