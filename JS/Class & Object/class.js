class Person {
    constructor(name, age) {
        this.name = name; // Property
        this.age = age;   // Property
    }

    // Method
    greet() {
        console.log(`Hello, my name is ${this.name} and I am ${this.age} years old.`);
    }
}