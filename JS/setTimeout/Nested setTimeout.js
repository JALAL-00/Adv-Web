console.log("Start");

setTimeout(() => {
    console.log("First task after 1 second");
    setTimeout(() => {
        console.log("Second task after another 2 seconds");
    }, 2000);
}, 1000);

console.log("End");