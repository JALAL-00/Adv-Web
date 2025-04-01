//A callback that is executed immediately.

function processArray(arr, callback) {
    for (let i = 0; i < arr.length; i++) {
        callback(arr[i]);
    }
}

processArray([1, 2, 3], (num) => {
    console.log(num * 2);
});
