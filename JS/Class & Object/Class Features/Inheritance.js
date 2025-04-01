//Classes can inherit properties and methods from other classes using the extends keyword.
//The super keyword is used to call the parent class's constructor.

class Animal {
    constructor(name) {
        this.name = name;
    }

    speak() {
        console.log(`${this.name} makes a sound.`);
    }
}

class Dog extends Animal {
    constructor(name, breed) {
        super(name); // Call the parent class constructor
        this.breed = breed;
    }

    speak() {
        console.log(`${this.name} barks.`);
    }
}

const dog = new Dog("Rex", "German Shepherd");
dog.speak(); // Output: Rex barks.