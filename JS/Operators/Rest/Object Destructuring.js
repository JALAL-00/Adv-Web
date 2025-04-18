const person = { name: "Alice", age: 25, job: "Developer", city: "New York" };
const { name, age, ...rest } = person;

console.log(name); // Output: Alice
console.log(age); // Output: 25
console.log(rest); // Output: { job: "Developer", city: "New York" }