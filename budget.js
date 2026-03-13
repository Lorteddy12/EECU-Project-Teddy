let choice = {};
const medicare = document.getElementById("medicare");
const socialSecurity = document.getElementById("SS");
const federalTax = document.getElementById("federal");
const stateTax = document.getElementById("state");
const careerInfo = document.getElementById("career");

async function getCareers() {
    const url = "https://eecu-data-server.vercel.app/data";
    try {
        const response = await fetch(url);
        const jobs = await response.json();
        createOptions(jobs);
        return jobs;
    } catch (error) {
        console.error("Error fetching careers data:", error);
        return [];
    }
}

// technical logic for taxes
function calculateTaxes(grossSalary) {
    const standardDeduction = 16100;
    const stateTaxRate = 0.04;
    const medicareRate = 0.0145;
    const ssRate = 0.062;

    // 1. Calculate taxable income
    const taxableIncome = Math.max(0, grossSalary - standardDeduction);

    // 2. applying federal brackets
    let federalTax = 0;
    if (taxableIncome <= 12400) {
        federalTax = taxableIncome * 0.10;
    } else if (taxableIncome <= 50400) {
        federalTax = (12400 * 0.10) + ((taxableIncome - 12400) * 0.12);
    } else {
        federalTax = (12400 * 0.10) + (38000 * 0.12) + ((taxableIncome - 50400) * 0.22);
    }

    // 3. calculate fixed taxes
    const stateTaxAmount = grossSalary * stateTaxRate;
    const medicareAmount = grossSalary * medicareRate;
    const ssAmount = grossSalary * ssRate;

    // 4. monthly breakdown
    const totalAnnualTax = federalTax + stateTaxAmount + medicareAmount + ssAmount;
    const monthlyNet = (grossSalary - totalAnnualTax) / 12;
    const monthlyGross = (grossSalary) / 12;
    const monthlyHeader = document.getElementById('monthlyHead');
    monthlyHeader.textContent = `Gross Monthly Income: $${monthlyGross.toLocaleString()}`;

    return {
        federal: federalTax / 12,
        state: stateTaxAmount / 12,
        medicare: medicareAmount / 12,
        ss: ssAmount / 12,
        net: monthlyNet
    };
}

function updateTaxDisplay(taxData) {
    // Updating the text of existing classes/IDs
    document.querySelector(".medicare").innerText = `Medicare: $${taxData.medicare.toFixed(2)}`;
    document.querySelector(".SS").innerText = `Social Security: $${taxData.ss.toFixed(2)}`;
    document.querySelector(".federal").innerText = `Federal Income Tax: $${taxData.federal.toFixed(2)}`;
    document.querySelector(".state").innerText = `State tax: $${taxData.state.toFixed(2)}`;

    // Updates Monthly Budget
    const netFormatted = taxData.net.toFixed(2);
    document.querySelector(".monthlyBudget").innerText = `Monthly Budget: $${netFormatted}`;

    const summaryBudget = document.getElementById("monthlyBudget");
    if (summaryBudget) summaryBudget.innerText = `$${netFormatted}`;
}

function createOptions(careers) {
    const dropdown = document.getElementById("careers");

    careers.forEach((career, index) => {
        const option = document.createElement("option");
        option.innerHTML = `${career.Occupation}: $${career.Salary}`;
        option.value = index; // Store the array index as the value
        option.classList.add("option");
        dropdown.appendChild(option);
    });

    dropdown.addEventListener("change", (event) => {
        const selectedIndex = event.target.value;

        choice.Occupation = careers[selectedIndex].Occupation;
        choice.Salary = careers[selectedIndex].Salary;

        saveChoice(choice);
        displayCareerInfo(choice);

        // Calculates and Updates the UI
        const taxResults = calculateTaxes(choice.Salary);
        updateTaxDisplay(taxResults);
    });
}

function saveChoice(choice) {
    let savedChoice = JSON.stringify(choice);
    localStorage.setItem("choices", savedChoice);
}

function loadChoice() {
    let savedChoices = JSON.parse(localStorage.getItem("choices")) || {};
    choice = savedChoices;

    if (choice.Salary) {
        const initialTaxes = calculateTaxes(choice.Salary);
        setTimeout(() => updateTaxDisplay(initialTaxes), 100);
    }
}

function displayCareerInfo(choice) {
    careerInfo.innerHTML = `Occupation: ${choice.Occupation}<br>Salary: $${choice.Salary}`;
}




loadChoice();
displayCareerInfo(choice);
getCareers();

function doTaxes() {
    const taxResults = calculateTaxes(choice.Salary);
    updateTaxDisplay(taxResults);
}

function printDraft() {
    const printContent = document.getElementById("print").innerHTML;
    const originalContent = document.body.innerHTML;

    document.body.innerHTML = printContent;

    document.body.innerHTML = originalContent;
    window.print();
}

function printPage() {
    window.print();
}

const housing = document.getElementById("housing"); //accessing input forms
const essentials = document.getElementById("essentials");
const loans = document.getElementById("student-loans");
const life = document.getElementById("life-style");
const savings = document.getElementById("future-proofing");

//figure out a method to grab the cost values and add them up for total expenses, be careful of addition errors
//possible solution: create variables and reassign to cost values in function
//let housingPrice = 0;
//let totalPrice = housingPrice + 
housing.addEventListener("input", (form) => {
    const div = document.getElementById("housingCost");
    let cost = form.target.value;

    div.innerHTML = `${cost}`;
    housingPrice = cost;
}
)
essentials.addEventListener("input", (form) => {
    const div = document.getElementById("essentialsCost");
    let cost = form.target.value;

    div.innerHTML = `${cost}`;
}
)
loans.addEventListener("input", (form) => {
    const div = document.getElementById("loansCost");
    let cost = form.target.value;

    div.innerHTML = `${cost}`;
}
)
life.addEventListener("input", (form) => {
    const div = document.getElementById("lifestyleCost");
    let cost = form.target.value;

    div.innerHTML = `${cost}`;
}
)
savings.addEventListener("input", (form) => {
    const div = document.getElementById("futureCost");
    let cost = form.target.value;

    div.innerHTML = `${cost}`;
}
)

// chart.js code to create a pie chart of expenses

// Data for our pie chart
const pieChartData = [
    { label: 'Housing', value: document.getElementById(), color: '#FF6384' },
    { label: 'Essentials', value: 50, color: '#36A2EB' },
    { label: 'Loans', value: 20, color: '#FFCE56' },
    { label: 'LifeStyle', value: 40, color: '#4BC0C0' },
    { label: 'Future', value: 10, color: '#9966FF' }
];

// Function to draw the pie chart
function drawPieChart(canvasId, data) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error(`Canvas element with ID '${canvasId}' not found.`);
        return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
        console.error("2D context not available for the canvas.");
        return;
    }

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(centerX, centerY) * 0.7; // 70% of the smaller dimension

    let totalValue = 0;
    data.forEach(item => {
        totalValue += item.value;
    });

    let currentAngle = 0;
    function addSlice() {
            const sliceNameInput = document.getElementById('sliceNameInput');
            const sliceValueInput = document.getElementById('sliceValueInput');
            const errorMsg = document.getElementById('errorMsg');

            const name = sliceNameInput.value.trim(); // .trim() removes leading/trailing whitespace
            const value = parseFloat(sliceValueInput.value);

            // Basic validation
            if (!name) {
                errorMsg.textContent = "Please enter a slice name.";
                return;
            }
            if (isNaN(value) || value < 0) {
                errorMsg.textContent = "Please enter a valid non-negative number for the value.";
                return;
            }

            // Create a new data object for the slice
            const newSlice = {
                label: name,
                value: value,
                // You could add a color property here too if you want user to pick colors
                // color: '#RRGGBB' // e.g., prompt for color or generate randomly
            };

            // Add the new slice to our dynamic data array
            dynamicPieChartData.push(newSlice);

            // Redraw the chart with the updated data
            drawPieChart('myPieChart', dynamicPieChartData);

            // Clear the input fields for the next entry
            sliceNameInput.value = '';
            sliceValueInput.value = '0';
            errorMsg.textContent = ''; // Clear any previous error messages
            sliceNameInput.focus(); // Set focus back to name input for convenience
        }

    data.forEach(item => {
        const sliceAngle = (item.value / totalValue) * Math.PI * 2; // Angle in radians

        // Draw the slice
        ctx.beginPath();
        ctx.moveTo(centerX, centerY); // Move to center of the circle
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fillStyle = item.color;
        ctx.fill();
        ctx.strokeStyle = '#fff'; // White border between slices
        ctx.lineWidth = 1;
        ctx.stroke();

        // Draw the label (optional, placed at the midpoint of the arc)
        const textAngle = currentAngle + sliceAngle / 2;
        const textX = centerX + Math.cos(textAngle) * (radius / 1.5); // Position closer to center
        const textY = centerY + Math.sin(textAngle) * (radius / 1.5);

        ctx.fillStyle = '#000'; // Text color
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Only show percentage if totalValue is not zero to avoid division by zero
        if (totalValue > 0) {
            const percentage = ((item.value / totalValue) * 100).toFixed(1);
            ctx.fillText(`${item.label} (${percentage}%)`, textX, textY);
        } else {
            ctx.fillText(item.label, textX, textY);
        }


        currentAngle += sliceAngle; // Update current angle for the next slice
    });
}

// Call the function to draw the chart when the page loads
document.addEventListener('DOMContentLoaded', () => {
    drawPieChart('myPieChart', pieChartData);
});
