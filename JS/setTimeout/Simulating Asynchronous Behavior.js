function fetchData(callback) {
    console.log("Fetching data...");
    setTimeout(() => {
        const data = { name: "Alice", age: 25 };
        callback(data);
    }, 2000);
}

fetchData((data) => {
    console.log("Data received:", data);
});

console.log("Continuing with other tasks...");