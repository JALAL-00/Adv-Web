//In Node.js, a common pattern is to pass an error as the first argument to a callback.

function divide(a, b, callback) {
    if (b === 0) {
        callback(new Error("Division by zero"));
    } else {
        callback(null, a / b);
    }
}

divide(10, 0, (err, result) => {
    if (err) {
        console.error("Error:", err.message);
    } else {
        console.log("Result:", result);
    }
});
// Output: Error: Division by zero