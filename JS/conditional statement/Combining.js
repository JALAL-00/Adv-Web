let temperature = 25;
let weather = "sunny";

if (temperature > 30) {
    console.log("It's hot outside!");
} else if (temperature > 20) {
    console.log("It's warm outside."); // Output: It's warm outside.
} else {
    console.log("It's cold outside.");
}

switch (weather) {
    case "sunny":
        console.log("Don't forget your sunglasses!"); // Output: Don't forget your sunglasses!
        break;
    case "rainy":
        console.log("Bring an umbrella.");
        break;
    default:
        console.log("Check the weather forecast.");
}