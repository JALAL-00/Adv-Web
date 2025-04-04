// Create an Object
const person = {
    firstName: "John",
    lastName: "Doe",
    age: 50
  };
  
  // Destructuring
  let {firstName, lastName} = person;
  console.log(firstName + " " + lastName);


/*
  //The order of the properties does not matter:
  const person = {
    firstName: "John",
    lastName: "Doe",
    age: 50
  };
  
  // Destructuring
  let {firstName, lastName} = person;
  console.log(lastName + " " + firstName); */