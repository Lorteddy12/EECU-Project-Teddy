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


const labels = ['Housing', 'Essentials', 'Loans', 'Lifestyle', 'Future'];
              const colors = ['#3266ad', '#5ca85c', '#d8703a', '#9b59b6', '#1aaa8c'];
              const ids = ['v0', 'v1', 'v2', 'v3', 'v4'];
             
              function getValues() {
                return ids.map(id => Math.max(0, parseFloat(document.getElementById(id).value) || 0));
              }
             
              const chart = new Chart(document.getElementById('pie'), {
                type: 'pie',
                data: {
                  labels,
                  datasets: [{
                    data: getValues(),
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#ffffff'
                  }]
                },
                options: {
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: { display: false },
                    tooltip: {
                      callbacks: {
                        label: (ctx) => {
                          const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                          const pct = total > 0 ? ((ctx.raw / total) * 100).toFixed(1) : 0;
                          return ` ${ctx.label}: ${ctx.raw.toLocaleString()} (${pct}%)`;
                        }
                      }
                    }
                  }
                }
              });
             
              function buildLegend(vals) {
                const total = vals.reduce((a, b) => a + b, 0);
                const el = document.getElementById('legend');
                el.innerHTML = labels.map((l, i) => {
                  const pct = total > 0 ? ((vals[i] / total) * 100).toFixed(1) : '0.0';
                  return `<span style="display:flex;align-items:center;gap:5px;">
                    <span style="width:10px;height:10px;border-radius:2px;background:${colors[i]};"></span>
                    ${l} ${pct}%
                  </span>`;
                }).join('');
              }
             
              function update() {
                const vals = getValues();
                const total = vals.reduce((a, b) => a + b, 0);
                chart.data.datasets[0].data = vals;
                chart.update();
                document.getElementById('total-label').textContent = 'Total: ' + total.toLocaleString();
                buildLegend(vals);
              }
             
              ids.forEach(id => document.getElementById(id).addEventListener('input', update));
              buildLegend(getValues());