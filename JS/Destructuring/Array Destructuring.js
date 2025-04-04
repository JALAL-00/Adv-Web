// Create an Array
const fruits = ["Bananas", "Oranges", "Apples", "Mangos"];

// Destructuring
let [fruit1, fruit2] = fruits;
console.log(fruit1 + " " + fruit2);

/* Skipping Array Values
We can skip array values using two or more commas:

// Create an Array
const fruits = ["Bananas", "Oranges", "Apples", "Mangos"];

// Destructuring
let [fruit1,,,fruit2] = fruits;
console.log(fruit1 + " " + fruit2);
*/