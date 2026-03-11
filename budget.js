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

let currentChart = null;

document.getElementById("but").addEventListener("click", () => {
    const canvas = document.getElementById("chartCanvas");
    const house = document.getElementById("housing").value;
    const essen = document.getElementById("essentials").value;
    const student = document.getElementById("student-loans").value;
    const life = document.getElementById("life-style").value;
    const future = document.getElementById("future-proofing").value;

    // Destroy old chart if it exists (common Chart.js gotcha)
    if (currentChart) currentChart.destroy();
  
    // Build chart config based on type
    const config = doughnutte (house, essen, student, life, future);
  
    currentChart = new Chart(canvas, config);
  });

// DOUGHNUT
function doughnutte(one, two, three, four, five) {
    

 return {
      type: "doughnut",
      data: {
        labels: ["Housing (%)", "Essentials (%)", "Student Loans (%)", "Life-style (%)", "Life-Style (%)"],
        datasets: [{ label: "Rider mix", data: [one, two, three, four, five] }]
      },
      options: {
        plugins: {
          title: { display: true, text: `Total Deduction: ${one} (${two}) ${three} ${four} ${five}` }
        }
      }
    };
  }
  
document.getElementById("chartCanvas").innerHtml


loadChoice();
displayCareerInfo(choice);
getCareers();