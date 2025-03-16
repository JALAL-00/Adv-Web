//The slice() method returns a shallow copy of a portion of an array into a new array. It does not modify the original array.

const fruits = ["Apple", "Banana", "Cherry", "Date"];
const slicedFruits = fruits.slice(1, 3);

console.log(slicedFruits); // Output: ["Banana", "Cherry"]
console.log(fruits); // Original array remains unchanged