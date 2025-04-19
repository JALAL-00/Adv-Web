console.log("Start");

const timeoutId = setTimeout(() => {
    console.log("This will not run");
}, 2000);

clearTimeout(timeoutId); // Cancels the timeout

console.log("End");