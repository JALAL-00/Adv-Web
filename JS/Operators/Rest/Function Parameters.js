function sum(a, b, ...rest) {
    let total = a + b;
    for (let num of rest) {
        total += num;
    }
    return total;
}

console.log(sum(1, 2, 3, 4, 5)); // Output: 15