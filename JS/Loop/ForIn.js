const person = { name: "Alice", age: 25, job: "Developer" };
for (let key in person) {
    console.log(`${key}: ${person[key]}`);
}