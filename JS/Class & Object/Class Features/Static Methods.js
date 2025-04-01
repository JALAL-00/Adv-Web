//Static methods belong to the class itself, not instances of the class.
//They are called using the class name.

class MathUtils {
    static square(x) {
        return x * x;
    }
}

console.log(MathUtils.square(5)); // Output: 25