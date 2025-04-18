for (let i = 0; i < 5; i++) {
    if (i === 3) break; // Exit the loop when i is 3
    console.log(i); 
}

for (let i = 0; i < 5; i++) {
    if (i === 3) continue; // Skip iteration when i is 3
    console.log(i);
}