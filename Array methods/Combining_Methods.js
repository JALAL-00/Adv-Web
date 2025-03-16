const numbers = [1, 2, 3, 4, 5];

const result = numbers
    .filter(num => num % 2 === 0) // Keep even numbers: [2, 4]
    .map(num => num * 2) // Double each number: [4, 8]
    .join(" and "); // Join into a string: "4 and 8"

console.log(result); // Output: "4 and 8"