const fs = require('fs');
const bigInt = require('big-integer');

// Main function to read files and print results
function main() {
    const filePath1 = 'testcase1.json';
    const filePath2 = 'testcase2.json';

    console.log('Constant term for Test Case 1: ' + findConstantTerm(filePath1));
    console.log('Constant term for Test Case 2: ' + findConstantTerm(filePath2));
}

// Function to find the constant term using parsed points
function findConstantTerm(filePath) {
    const points = parseJson(filePath);

    if (Object.keys(points).length < 2) {
        console.error("Insufficient data points to perform interpolation.");
        return bigInt(0);
    }

    return lagrangeInterpolation(points);
}

// Function to parse JSON data from file
function parseJson(filePath) {
    const points = {};

    try {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

        // Extract number of roots and minimum roots required
        const { n, k } = data.keys;

        // Parse each point (x, y) from JSON
        for (const [key, value] of Object.entries(data)) {
            if (key === "keys") continue;

            const x = parseInt(key);
            const base = parseInt(value.base);
            const yValue = value.value;

            const y = bigInt(yValue, base);
            points[x] = y;
        }
    } catch (error) {
        console.error("Error reading JSON file:", error);
    }

    return points;
}

// Function for Lagrange interpolation to find constant term
function lagrangeInterpolation(points) {
    let result = bigInt(0);

    for (const [xi, yi] of Object.entries(points)) {
        let term = yi;

        for (const [xj, yj] of Object.entries(points)) {
            if (xi !== xj) {
                term = term.multiply(bigInt(-xj)).divide(bigInt(xi).minus(xj));
            }
        }

        result = result.add(term);
    }

    return result;
}

// Run the main function
main();
