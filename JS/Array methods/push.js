//The push() method adds one or more elements to the end of an array and returns the new length of the array. It modifies the original array.

const numbers = [1, 2, 3];
const newLength = numbers.push(4, 5);

console.log(numbers); // Output: [1, 2, 3, 4, 5]
console.log(newLength); // Output: 5