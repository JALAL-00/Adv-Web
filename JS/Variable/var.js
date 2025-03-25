//Redeclaring Variables
//Redeclaring a variable using the var keyword can impose problems.

//Redeclaring a variable inside a block will also redeclare the variable outside the block:

var x = 10;
// Here x is 10

{
var x = 2;
// Here x is 2
}

console.log(x)