//When multiple asynchronous operations depend on each other, callbacks can become nested, leading to callback hell.

setTimeout(() => {
    console.log("First operation");
    setTimeout(() => {
        console.log("Second operation");
        setTimeout(() => {
            console.log("Third operation");
        }, 1000);
    }, 1000);
}, 1000);

//Use Promises or async/await to avoid callback hell.
