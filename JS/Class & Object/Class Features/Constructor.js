//The constructor method is called automatically when a new object is created.
//It is used to initialize object properties.

class Car {
    constructor(brand, model) {
        this.brand = brand;
        this.model = model;
    }
}

const myCar = new Car("Toyota", "Corolla");
console.log(myCar.brand); // Output: Toyota