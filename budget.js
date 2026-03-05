


const housing = document.getElementById("housing"); //accessing input forms
const essentials = document.getElementById("essentials");
const loans = document.getElementById("student-loans");
const life = document.getElementById("life-style");
const savings = document.getElementById("future-proofing");
const url = 'https://eecu-data-server.vercel.app/data';
//figure out a method to grab the cost values and add them up for total expenses, be careful of addition errors
//possible solution: create variables and reassign to cost values in function
//let housingPrice = 0;
//let totalPrice = housingPrice + 

async function data() {
    const url = 'https://eecu-data-server.vercel.app/data';
    let list = [];

    try {
        const jobs = await fetch(url);
        for (let i = 0; i < jobs.length; i++) {
            const job = jobs[i];
            const occupation = job.Occupation;
            const salary = job.Salary;
            list.push({
                Occupation: occupation,
                Salary: salary
            });
        
    } console.log(list);
    } catch (err) {
        console.error('Error fetching data:', err);
    }

} //side note: the two attrivutes per object is .Occupation and .Salary
console.log(data());

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

// async function getCareer(url) {
//     const response = await fetch("https://eecu-data-server.vercel.app/data/2023");
//     const e = await response.json(url);
//     return e;
// }
