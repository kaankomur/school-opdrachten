let getal1 = parseFloat(prompt("Kies een getal"));
let operator = prompt("Kies uit + - * /");
let getal2 = parseFloat(prompt("Kies een getal"));

let resultaat;

if (operator === "+") {
    resultaat = getal1 + getal2;
} else if (operator === "-") {
    resultaat = getal1 - getal2;
} else if (operator === "*") {
    resultaat = getal1 * getal2;
} else if (operator === "/") {
    resultaat = getal1 / getal2;
} else {
    resultaat = "Dit is een ongeldige invoer!";
}

console.log("Het resultaat is", resultaat);
