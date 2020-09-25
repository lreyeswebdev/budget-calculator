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

const incomeList = document.querySelector("#income-list-items");
const expenseList = document.querySelector("#expense-list-items");


// Class declaration
let BudgetItem = function(operator, description, value) {
    this.operator = operator;
    this.description = description;
    this.value = value;
}

// Event listener
addBtn.addEventListener('click', () => {
    // Object
    let newItem = new BudgetItem(operator.value, itemDesc.value, itemValue.value) 

    if (operator.value === 'inc') {
        incItems.push(newItem);
        addIncomeItem(incomeList);
    } else { 
        expItems.push(newItem);
        addExpenseItem(expenseList);
    }
    displayValue();
    // clears input form
    itemDesc.value = "";
    itemValue.value = "";        
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
    totalPercentage = Math.round((totalValue(expItems)/totalValue(incItems)) * 100);
    return totalPercentage + "%";
}

// Display values in HTML
function displayValue() {
    budgetTotalValue.innerHTML = totalBudget();
    incomeTotalValue.innerHTML = totalValue(incItems);
    expenseTotalValue.innerHTML = totalValue(expItems);
    percTotalValue.innerHTML = calcPercentage();
}


// Add items
function addIncomeItem(list) {
    let budgetListItem = `<li class="list-item">
    <div class="item__description">${itemDesc.value}</div>
    <div class="item__value">${itemValue.value}</div>
    <div class="item__delete"><button id="delBtn" class="item_delete--btn">X</button></div>
    </li>
    `;
    
    list.insertAdjacentHTML('beforeend', budgetListItem);
}

function addExpenseItem(list) {
    let budgetListItem = `<li class="list-item">
    <div class="item__description">${itemDesc.value}</div>
    <div class="item__value">${itemValue.value}</div>
    <div class="item__percentage">${Math.round((itemValue.value/totalValue(incItems)) * 100) + "%"}</div>
    <div class="item__delete"><button class="item__delete--btn">X</button></div>
    </li>
    `;
    
    list.insertAdjacentHTML('beforeend', budgetListItem);
}
