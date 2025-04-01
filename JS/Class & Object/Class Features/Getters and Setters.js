//Getters and setters allow you to define custom behavior for accessing and modifying properties.

class Circle {
    constructor(radius) {
        this.radius = radius;
    }

    // Getter
    get area() {
        return Math.PI * this.radius ** 2;
    }

    // Setter
    set diameter(diameter) {
        this.radius = diameter / 2;
    }
}

const circle = new Circle(5);
console.log(circle.area); // Output: 78.53981633974483

circle.diameter = 20;
console.log(circle.radius); // Output: 10