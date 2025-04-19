const isLoggedIn = true;
const user = { name: "Alice" };

const message = `Welcome, ${
    isLoggedIn ? `${user.name}` : "Guest"
}!`;

console.log(message); // Output: Welcome, Alice!