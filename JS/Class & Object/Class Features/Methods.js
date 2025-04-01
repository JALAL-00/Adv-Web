//Methods are functions defined inside a class.
//They can access and modify the object's properties using this.

class Car {
    constructor(brand, model) {
        this.brand = brand;
        this.model = model;
    }

    displayInfo() {
        console.log(`This is a ${this.brand} ${this.model}.`);
    }
}

const myCar = new Car("Toyota", "Corolla");
myCar.displayInfo(); // Output: This is a Toyota Corolla.
