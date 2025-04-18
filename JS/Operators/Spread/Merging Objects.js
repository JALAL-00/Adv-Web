const obj1 = { name: "Alice" };
const obj2 = { age: 25 };
const merged = { ...obj1, ...obj2 };

console.log(merged); // Output: { name: "Alice", age: 25 }