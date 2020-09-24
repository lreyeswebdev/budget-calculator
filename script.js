// 1. able to list down incomes and expenses
// 2. able to subtract expenses with the total amount value
// 3. able to add income with the total amount value
// 4. able to indicate what is the description of either the income or expense
// 5. able to compute what percentage is each expense
// 6. able to compute the total percentage of expenses
// 7. able to show the total amount value.

// HTML elements
const itemDesc = document.querySelector("#itemDesc");
const itemValue = document.querySelector("#itemValue");
const operator = document.querySelector(".add__type");
const addBtn = document.querySelector("#addBtn");

const incItems = [];
const expItems = [];

const budgetTotalValue = document.querySelector(".budget__value");
const incomeTotalValue = document.querySelector(".budget__income--value");
const expenseTotalValue = document.querySelector(".budget__expenses--value");
const percTotalValue =  document.querySelector(".budget__expenses--percentage");


// Class declaration
let BudgetItem = function(operator, description, value) {
    this.operator = operator;
    this.description = description;
    this.value = value;
}

addBtn.addEventListener('click', () => {
    // Object
    let newItem = new BudgetItem(operator.value, itemDesc.value, itemValue.value)

    if (operator.value === 'inc') {
        incItems.push(newItem)
    } else { 
        expItems.push(newItem);
    }
    displayValue();
    console.log("Income Items: ", incItems);
    console.log("Expense Items: ", expItems);
    console.log("Total Income: ", totalValue(incItems));
    console.log("Total Expense: ", totalValue(expItems));
    console.log("Total Budget: ", totalBudget());
    console.log("Total Percentage of Expense: ", calcPercentage());
});

// Get total values in arrays
function totalValue(arr) {
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
        total += parseFloat(arr[i].value);  
    }
    return total;
};

// Substracts expenses from total amount
function totalBudget() {
    totalBudgetAmount = totalValue(incItems) - totalValue(expItems);
    return totalBudgetAmount;
}

// Calculate percentage of total expenses from total income
function calcPercentage() {
    totalPercentage = ((totalValue(expItems)/totalValue(incItems)) * 100);
    return totalPercentage + "%";
}

// Display values in HTML
function displayValue() {
    budgetTotalValue.innerHTML = totalBudget();
    incomeTotalValue.innerHTML = totalValue(incItems);
    expenseTotalValue.innerHTML = totalValue(expItems);
    percTotalValue.innerHTML = calcPercentage();
}

