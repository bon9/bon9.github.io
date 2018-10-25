//BUDGET CONTROLLER Модуль, обрабатывающий бюджетные данные 
var budgetController = (function () {

	var Expense = function (id, description, value) { //расходы 
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	Expense.prototype.calcPercentage = function (totalIncome) { // процент траты от общего заработка
		if (totalIncome > 0) {
			this.percentage = Math.round((this.value / totalIncome) * 100);
		} else {
			this.percentage = -1;
		}
	};

	Expense.prototype.getPercentage = function () { //вовращаем для видимости
		return this.percentage;
	}

	var Income = function (id, description, value) { //доходы
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var calculateTotal = function (type) { //калькулятор для суммы
		var sum = 0;
		data.allItems[type].forEach(function (cur) {
			sum += cur.value;
		});
		data.totals[type] = sum;
	};

	var data = { //конструкция для принятия и хранения данных
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
	};

	return {

		// добавления итема в структуру и возврат итема
		addItem: function (type, des, val) {
			var newItem, ID;
			//[1 2 3 4 5], next ID = 6
			//[1 2 4 6 8], next ID = 9
			//ID = last ID + 1
			//Create new ID 
			if (data.allItems[type].length > 0) {
				ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
			} else {
				ID = 0;
			}

			//Create new item based on 'inc' or 'exp' type
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}

			//Push it into your data structure
			data.allItems[type].push(newItem);

			//return the new element and save him in ctrlAddItem.newItem
			return newItem;
		},

		deleteItem: function (type, id) {
			// id = 6
			// ids = [1 2 4 6 8]
			// index = 3

			ids = data.allItems[type].map(function (cur) {
				return cur.id;
			});
			index = ids.indexOf(id);
			if (index !== -1) {
				data.allItems[type].splice(index, 1);
			}
		},

		// расчеты
		calculateBudget: function () {
			// calculate total inocme and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			// calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;

			//calculate the percentage of income that we spent
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
			} else {
				data.percentage = -1;
			}
		},

		calculatePercentages: function () {
			data.allItems.exp.forEach(function (cur) {
				cur.calcPercentage(data.totals.inc);
			});
		},

		getPercentages: function () {
			var allPrec = data.allItems.exp.map(function (cur) {
				return cur.getPercentage();
			});
			return allPrec;
		},

		// возврат выполненых расчетов
		getBudget: function () {
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		},

		testItem: function () {
			console.log(data);
		}
	};

})();


//UI CONTROLLER Модуль пользовательского интерфейса
var UIController = (function () {

	var DOMstrings = { // если нужно будет в ХТМЛ изменить классы,
		inputType: '.add__type', // то нам их придется поменять в JS только тут,
		inputDescription: '.add__description',// а не по всему коду
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expensesContainer: '.expenses__list',
		budgetLabel: '.budget__value',
		incomeLabel: '.budget__income--value',
		expensesLabel: '.budget__expenses--value',
		precentageLabel: '.budget__expenses--percentage',
		container: '.container',
		expensesPercLabel: '.item__percentage',
		dateLabel: '.budget__title--month'
	}

	var formatNumber = function (num, type) {
		var numSplit, int, dec;
		// + or - before nubmer
		// exactly 2 decimal points
		// comma separating the thousands
		// 2310.4565 -> + 2,310.46
		// 2000 -> + 2,000.00
		num = Math.abs(num);
		num = num.toFixed(2);

		numSplit = num.split('.');

		int = numSplit[0];
		if (int.length > 3) {
			int = int.substr(0, int.length - 3) + ', ' + int.substr(int.length - 3, int.length); //input 31350, output 31,350
		}

		dec = numSplit[1];

		return (type === 'exp' ? '-' : '+') + ' ' + int + '.' + dec;
	};

	var nodeListForEach = function (list, callback) {
		for (var i = 0; i < list.length; i++) {
			callback(list[i], i);
		}
	};

	return {

		getInput: function () { // функция read input data
			return {
				type: document.querySelector(DOMstrings.inputType).value,
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			};
		},

		addListItem: function (obj, type) { //добавление записи графически
			var html, newHtml, element;

			// Create HTML string with placeholder text
			if (type === 'inc') {
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			} else if (type === 'exp') {
				element = DOMstrings.expensesContainer;
				html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
			}

			// Replace the placeholder text with some actual data
			newHtml = html.replace('%id%', obj.id);
			newHtml = newHtml.replace('%description%', obj.description);
			newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));

			// Insert the HTML into the DOM
			//вставляет как последний дочерний
			document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
		},

		deleteListItem: function (selectorID) { //удаления записи графически
			el = document.getElementById(selectorID); //находим элемент для удаления
			el.parentNode.removeChild(el); //удаляем его как ребенка родителя
		},

		clearFields: function () { //очистка заполненых полей после клика
			var fields, fieldsArr;

			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue); //querySelectorAll возвращает лист, а в нём нету методов массива. Нужно преобразовать список в массив. Есть трюк - использовать метод массива slice(), но передать в него лист и он всё равно вернёт массив. fields.slice() работать не будет, т.к. fields не массив. Поэтому вызовим call из Function.prototype для метода slice из . Array.prototype и это реально т.к. методы наследуются:
			fieldsArr = Array.prototype.slice.call(fields);

			fieldsArr.forEach(function (cur, i, arr) {
				cur.value = ""; //очистим значения каждого эл-та массива
			});

			fieldsArr[0].focus(); //ставим фокус на описание

		},

		displayBudget: function (obj) { //занесения данных бюджета в UI
			var type;
			obj.budget > 0 ? type = 'inc' : type = 'exp';

			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(DOMstrings.expensesLabel).textContent = formatNumber(obj.totalExp, 'exp');
			if (obj.percentage > 0) {
				document.querySelector(DOMstrings.precentageLabel).textContent = obj.percentage + '%';
			} else {
				document.querySelector(DOMstrings.precentageLabel).textContent = '---';
			}
		},

		displayPercentages: function (percentages) {
			var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

			nodeListForEach(fields, function (current, index) {
				if (percentages[index] > 0) {
					current.textContent = percentages[index] + '%';
				} else {
					current.textContent = '---';
				}

			});
		},

		displayMonth: function () {
			var now, year, month, months;
			now = new Date();

			year = now.getFullYear();

			months = ['January', 'Februaty', 'March', 'Aprile', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			month = now.getMonth();
			document.querySelector(DOMstrings.dateLabel).textContent = months[month] + ' ' + year;
		},

		changedType: function () {
			var fields = document.querySelectorAll(
				DOMstrings.inputType + ',' +
				DOMstrings.inputDescription + ',' +
				DOMstrings.inputValue);

			nodeListForEach(fields, function (cur) {
				cur.classList.toggle('red-focus');
			});

			document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
		},

		getDOMstrings: function () { //доступ переменных в другие модули
			return DOMstrings;
		}
	};


})();


//GLOBAL APP CONTROLLER Контроллер приложения (соединяющий обрабатывающий и пользовательский модули)
var controller = (function (budgetCtrl, UICtrl) {

	// ФУНКЦИЯ обработки событий
	var setupEventListeners = function () {
		var DOM = UICtrl.getDOMstrings();

		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
		//для keypress обязателен аргумент, обычно event или просто e
		document.addEventListener('keypress', function (event) {
			//в некоторых браузерах в место keyCode исп. which
			if (event.keyCode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});

		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
	};

	// ФУНКЦИЯ обновление бюджета
	var updateBudget = function () {
		// 1. Calculate the budget
		budgetCtrl.calculateBudget();

		// 2. return budget
		var budget = budgetCtrl.getBudget();

		// 3. Display the budget on the UI
		UICtrl.displayBudget(budget);
	};

	// ФУНКЦИЯ обновление процентов каждого расхода
	var updatePercentage = function () {
		// 1. Calculate percentages
		budgetCtrl.calculatePercentages();

		// 2. Read percentages from the budget controller
		var percentages = budgetCtrl.getPercentages();

		// 3. Update the UI with the new percentages
		UICtrl.displayPercentages(percentages);
	};

	// ФУНКЦИЯ добавления записи
	var ctrlAddItem = function () {

		var input, newItem;

		// 1. Get the field input data
		input = UICtrl.getInput();

		if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
			// 2. Add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// 3. Add the item to the UI
			UICtrl.addListItem(newItem, input.type);

			// 4. Clear fields
			UICtrl.clearFields();

			// 5. Calculate and update budget
			updateBudget();

			// 6. Calculate and update percentages
			updatePercentage();
		}
	};

	// ФУНКЦИЯ удаления элемента
	var ctrlDeleteItem = function (event) {
		var itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id; //родитель элемента fired, доходим до class "item" с ID
		if (itemID) {

			splitID = itemID.split('-'); //if itemID = inc-1, то  splitID = ['inc', '1']
			type = splitID[0];
			ID = +splitID[1];

			// 1. delete the item from the data structure
			budgetCtrl.deleteItem(type, ID);

			// 2. delete the item from the UI
			UICtrl.deleteListItem(itemID);

			// 3. update and show the new budget
			updateBudget();

			// 4. Calculate and update percentages
			updatePercentage();

		}

		// console.log(event.target.closest('.item'));

	};

	// возврат для ФУНКЦИЯ инициализации
	return {
		init: function () {
			UICtrl.displayMonth();
			UICtrl.displayBudget({ //устанавливаем в 0 показатели при запуске 
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			setupEventListeners(); //и запускаем функцию обработки событий
		}
	};

})(budgetController, UIController);

controller.init();