var budgetController = (function() {

    var Income = function(id, description, value) {
        this.id = id;    
        this.description = description;
        this.value = value;
    };

    var Expense = function(id, description, value) {
        this.id = id;    
        this.description = description;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function(totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        } else {
            this.percentage = -1;
        }
    };

    Expense.prototype.getPercentage = function() {
        return this.percentage;
    };

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0,
        },
        budget: 0,
        percentage: -1
    };

    var totalValue = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(cur) {
            sum += cur.value;
        });
        data.totals[type] = sum;
    };

    return {
        addItem: function(type, des, val) {
            var newItem, ID;

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }

            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }
            data.allItems[type].push(newItem);

            return newItem;
        },

        deleteItem: function(type, id) {
            var ids, index;

            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            index = ids.indexOf(id);        

            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }
        },

        totalBudget: function() {
            totalValue('exp');
            totalValue('inc');

            data.budget = data.totals.inc - data.totals.exp;

            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }
        },

        calculatePercentages: function() {
            data.allItems.exp.forEach(function(cur) {
                cur.calcPercentage(data.totals.inc);
            });
        },

        getPercentages: function() {
            var allPerc = data.allItems.exp.map(function(cur) {
                return cur.getPercentage();
            });
            return allPerc;
        },

        getBudget: function() {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            };
        }
    };
})();

var htmlController = (function() {

    var htmlElements = {
        itemDesc: '.add__description',
        itemValue: '.add__value',
        operator: '.add__type',
        addBtn: '.add__btn',
        budgetTotalValue: '.budget__value',
        incomeTotalValue: '.budget__income--value',
        expenseTotalValue: '.budget__expenses--value',
        percTotalValue: '.budget__expenses--percentage',
        incomeList: '.income__list',
        expenseList: '.expenses__list',
        dateLabel: '.budget__title--month',
        percExp: '.item__percentage',
        dateDisplay: '.budget__title--month',
        container: '.container'
    };

    var numberFormat = function(num, type) {
        var numSplit, int, dec, type;

        num = Math.abs(num);
        num = num.toFixed(2);

        numSplit = num.split('.');

        int = numSplit[0];
        if (int.length > 6) {
            int = int.substr(0,int.length-6) + ',' + int.substr(int.length - 6, 3) + ',' + int.substr(int.length-3,3);
        } else if (int.length > 3) {
            int = int.substr(0, int.length - 3) + ',' + int.substr(int.length - 3, 3);
        }

        dec = numSplit[1];

        return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec; 
    };

    var nodeListForEach = function(list, callback) {
        for (var i = 0; i < list.length; i++) {
            callback(list[i], i);
        }
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(htmlElements.operator).value,
                description: document.querySelector(htmlElements.itemDesc).value,
                value: parseFloat(document.querySelector(htmlElements.itemValue).value)
            };
        },

        addListItem: function(obj, type) {
            var budgetListItem, newBudgetListItem, element;

            if (type === 'inc') {
                element = htmlElements.incomeList;

                budgetListItem = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="far fa-times-circle"></i></button></div></div></div>';
            } else if (type === 'exp') {
                element = htmlElements.expenseList;

                budgetListItem = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="far fa-times-circle"></i></button></div></div></div>';
            }

            newBudgetListItem = budgetListItem.replace('%id%', obj.id);
            newBudgetListItem = newBudgetListItem.replace('%description%', obj.description);
            newBudgetListItem = newBudgetListItem.replace('%value%', numberFormat(obj.value, type));

            document.querySelector(element).insertAdjacentHTML('beforeend', newBudgetListItem);
        },

        deleteListItem: function(selectorID) {
            var el = document.getElementById(selectorID);
            el.parentNode.removeChild(el);
        },

        clearFields: function() {
            var fields, fieldsArr;

            fields = document.querySelectorAll(htmlElements.itemDesc + ', ' + htmlElements.itemValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array) {
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj) {
            var type;
            obj.budget > 0 ? type = 'inc' : type = 'exp';

            document.querySelector(htmlElements.budgetTotalValue).textContent = numberFormat(obj.budget, type);
            document.querySelector(htmlElements.incomeTotalValue).textContent = numberFormat(obj.totalInc, 'inc');
            document.querySelector(htmlElements.expenseTotalValue).textContent = numberFormat(obj.totalExp, 'exp');

            if (obj.percentage > 0) {
                document.querySelector(htmlElements.percTotalValue).textContent = obj.percentage + '%';
            } else {
                document.querySelector(htmlElements.percTotalValue).textContent = '---';
            }
        },

        displayPercentages: function(percentages) {
            var fields = document.querySelectorAll(htmlElements.percExp);

            nodeListForEach(fields, function(current, index) {
                if (percentages[index] > 0) {
                    current.textContent = percentages[index] + '%';
                } else {
                    current.textContent = '---';
                }
            });
        },

        displayMonth: function() {
            var options = { month:'long', year:'numeric'};

            var today = new Date();
            document.querySelector(htmlElements.dateDisplay).textContent = today.toLocaleDateString("en-US", options);
        },

        changedType: function() {
            var fields = document.querySelectorAll(
                htmlElements.operator + ',' +
                htmlElements.itemDesc + ',' +
                htmlElements.itemValue);
            
            nodeListForEach(fields, function(cur) {
                cur.classList.toggle('red-focus');
            });

            document.querySelector(htmlElements.addBtn).classList.toggle('red');
        },

        getHtmlElements: function() {
            return htmlElements;
        }
    };
})();

var mainController = (function(budgetCtrl, htmlCtrl) {

    var setupEventListeners = function() {
        var html = htmlCtrl.getHtmlElements();

        document.querySelector(html.addBtn).addEventListener('click', ctrlAddItem);
        document.querySelector(html.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(html.operator).addEventListener('change', htmlController.changedType);
    };

    var updateBudget = function() {
        budgetCtrl.totalBudget();
        var budget = budgetCtrl.getBudget();
        htmlCtrl.displayBudget(budget);
    };

    var updatePercentages = function() {
        budgetCtrl.calculatePercentages();
        var percentages = budgetCtrl.getPercentages();
        htmlCtrl.displayPercentages(percentages);
    };

    var ctrlAddItem = function() {
        var input, newItem;

        input = htmlCtrl.getInput();

        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            htmlCtrl.addListItem(newItem, input.type);
            htmlCtrl.clearFields();
            updateBudget();
            updatePercentages();
        }
    };

    var ctrlDeleteItem = function(event) {
        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            budgetCtrl.deleteItem(type, ID);
            htmlCtrl.deleteListItem(itemID);
            updateBudget();
            updatePercentages();
        }
    };

    return {
        init: function() {
            console.log('Application has started.');
            htmlCtrl.displayMonth();
            htmlCtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };
})(budgetController, htmlController);

mainController.init();