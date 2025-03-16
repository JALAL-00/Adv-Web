//Redeclaring a variable using the let keyword can solve this problem.

//Redeclaring a variable inside a block will not redeclare the variable outside the block:

let x = 10;
// Here x is 10

{
let x = 2;
// Here x is 2
}

console.log(x)