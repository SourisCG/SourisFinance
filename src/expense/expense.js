import { insertExpense } from "../utilities/database";
import { insertIncome } from "../utilities/database";
import { getAllExpenses } from "../utilities/database";
import { getAllIncomes } from "../utilities/database";
import { deleteExpense } from "../utilities/database";
import { deleteIncome } from "../utilities/database";

const incomeForm = document.getElementById("income-form");
const ExpenseForm = document.getElementById("expense-form");
const dataTableBody = document.getElementById("data-table-body");

document.querySelectorAll("input[type='number']").forEach(input => {
    input.addEventListener("wheel", (event) => {
        event.preventDefault();
    });
});

dataTableBody.addEventListener("click", async (event) => {
    if (event.target.classList.contains("delete-button")) {
        try {
            const button = event.target;
            const id = button.getAttribute("data-id");
            const type = button.getAttribute("data-type");

            if (type === "expense") {
                await deleteExpense(id);
            } else if (type === "income") {
                await deleteIncome(id);
            }

            loadTable();
        } catch (error) {
            console.error("Error deleting item: ", error);
        }
    }
});

loadTable();

incomeForm.addEventListener("submit", async (event) => {
    try {
        event.preventDefault();

        const incomeAmount = parseFloat(document.getElementById("income-amount").value);
        const incomeDescription = document.getElementById("income-description").value;

        const income = {
            amount: Number(incomeAmount),
            description: incomeDescription,
            date: new Date().toISOString()
        };

        await insertIncome(income);
        loadTable();
    } catch (error) {
        console.error("Error inserting income: ", error);
    }
});

ExpenseForm.addEventListener("submit", async (event) => {
    try {
        event.preventDefault();

        const expenseAmount = parseFloat(document.getElementById("expense-amount").value);
        const expenseDescription = document.getElementById("expense-description").value;

        const expense = {
            amount: Number(expenseAmount),
            description: expenseDescription,
            date: new Date().toISOString()
        };

        await insertExpense(expense);
        loadTable();
    } catch (error) {
        console.error("Error inserting expense: ", error);
    }
});



async function loadTable() {
    const expenses = await getAllExpenses();
    const incomes = await getAllIncomes();
    const dates = [...expenses, ...incomes].map(item => new Date(item.date));

    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    const totalIncomes = incomes.reduce((total, income) => total + income.amount, 0);

    const balance = totalIncomes - totalExpenses;

    const tableBody = document.getElementById("data-table-body");
    tableBody.innerHTML = "";


    incomes.forEach(income => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>Income</td>
            <td>${income.amount}</td>
            <td>${income.description}</td>
            <td>${dates.find(d => d.toISOString() === income.date).toLocaleDateString()}</td>
            <td><button class="delete-button" data-id="${income.id}" data-type="income">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });

    expenses.forEach(expense => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>Expense</td>
            <td>${expense.amount}</td>
            <td>${expense.description}</td>
            <td>${dates.find(d => d.toISOString() === expense.date).toLocaleDateString()}</td>
            <td><button class="delete-button" data-id="${expense.id}" data-type="expense">Delete</button></td>
        `;
        tableBody.appendChild(row);
    });

    const totalAmountElement = document.getElementById("total-amount");
    totalAmountElement.textContent = `Balance: $${balance.toFixed(2)}`;
}

