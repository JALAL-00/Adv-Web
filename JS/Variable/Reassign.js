/*
1. Var
Reassignment: Variables declared with var can be reassigned.
Scope: var is function-scoped (or globally scoped if declared outside a function).
Hoisting: var declarations are hoisted to the top of their scope, meaning they are accessible before the line where they are declared (but will be undefined).
*/

var x = 10;
console.log(x); // 10

x = 20; // Reassigning
console.log(x); // 20

if (true) {
    var y = 30; // 'var' is function-scoped, so 'y' is accessible outside the block
}
console.log(y); // 30 (accessible outside the block)

/*
2. let

Reassignment: Variables declared with let can be reassigned.
Scope: let is block-scoped, meaning it is confined to the block in which it is declared.
Hoisting: let declarations are hoisted but not initialized, so accessing them before declaration results in a ReferenceError.
*/

let a = 10;
console.log(a); // 10

a = 20; // Reassigning
console.log(a); // 20

if (true) {
    let b = 30; // 'let' is block-scoped, so 'b' is not accessible outside the block
    console.log(b); // 30
}
console.log(b); // Error: 'b' is not defined

/*
3. const

Reassignment: Variables declared with const cannot be reassigned. However, if the variable is an object or array, its properties or elements can be modified.
Scope: const is block-scoped, just like let.
Hoisting: const declarations are hoisted but not initialized, so accessing them before declaration results in a ReferenceError.
*/

const c = 10;
console.log(c); // 10

c = 20; // Error: Assignment to constant variable

if (true) {
    const d = 30; // 'const' is block-scoped, so 'd' is not accessible outside the block
    console.log(d); // 30
}
console.log(d); // Error: 'd' is not defined