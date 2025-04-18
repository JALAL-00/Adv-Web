/* The behavior of this depends on how the function is called and whether it is an arrow function or a regular function.

Regular Functions: this refers to the object that called the function.
Arrow Functions: this is lexically scoped, meaning it uses this from the surrounding context where the arrow function is defined. */

const obj = {
    value: 42,
    regularFunction: function() {
        console.log(this.value);
    }
};

obj.regularFunction(); // Output: 42

/*
const obj = {
    value: 42,
    arrowFunction: () => {
        console.log(this.value);
    }
};

obj.arrowFunction(); // Output: undefined (since `this` refers to the global/window object) */