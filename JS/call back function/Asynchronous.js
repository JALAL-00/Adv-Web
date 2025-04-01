//A callback that is executed after an asynchronous operation completes.

function fetchData(callback) {
    setTimeout(() => {
        const data = "Some data";
        callback(data);
    }, 2000); // Simulate a 2-second delay
}

fetchData((data) => {
    console.log("Data received:", data);
});