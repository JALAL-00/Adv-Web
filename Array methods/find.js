//The find() method returns the first element in the array that satisfies the provided testing function. If no element is found, it returns undefined.

const users = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" }
];

const user = users.find(u => u.id === 2);
console.log(user); // Output: { id: 2, name: "Bob" }