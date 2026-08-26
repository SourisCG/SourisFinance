import { insertExpense } from "../utilities/database";
import { insertIncome } from "../utilities/database";
import { getAllExpenses } from "../utilities/database";
import { getAllIncomes } from "../utilities/database";
import { deleteExpense } from "../utilities/database";
import { deleteIncome } from "../utilities/database";

const incomeForm = document.getElementById("income-form");
const ExpenseForm = document.getElementById("expense-form");
const periodSelect = document.getElementById("period-selection");
const listContainer = document.getElementById("expense-list-container");

// Returns the Monday (start of the week) at 00:00
function startOfWeek(date) {
    const d = new Date(date);
    const day = (d.getDay() + 6) % 7; // domingo=0 -> lunes=0
    d.setDate(d.getDate() - day);
    d.setHours(0, 0, 0, 0);
    return d;
}

// Key that defines which block each item belongs to
function getKey(item, period) {
    const d = new Date(item.date);
    if (period === "months") return d.toISOString().slice(0, 7);                 // "2026-08"
    if (period === "weeks")   return startOfWeek(d).toISOString().slice(0, 10);  // "2026-08-24"
    return d.toISOString().slice(0, 10);                                         // "2026-08-25" (days)
}

// Pretty text for the block title
function formatTitle(key, period) {
    if (period === "months") {
        const [y, m] = key.split("-");
        return new Date(Number(y), Number(m) - 1, 1)
            .toLocaleDateString("en-US", { month: "long", year: "numeric" });
    }
    const date = new Date(key + "T00:00:00");
    if (period === "weeks") {
        return "Week of " + date.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" });
    }
    return date.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

// Delete via event delegation
listContainer.addEventListener("click", async (event) => {
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

            loadTable(periodSelect.value);
        } catch (error) {
            console.error("Error deleting item: ", error);
        }
    }
});

document.querySelectorAll("input[type='number']").forEach(input => {
    input.addEventListener("wheel", (event) => {
        event.preventDefault();
    });
});

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
        loadTable(periodSelect.value);
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
        loadTable(periodSelect.value);
    } catch (error) {
        console.error("Error inserting expense: ", error);
    }
});

periodSelect.addEventListener("change", (e) => loadTable(e.target.value));

async function loadTable(period) {
    const expenses = await getAllExpenses();
    const incomes = await getAllIncomes();

    // Merge everything and tag the type (description or source, depending on schema)
    const items = [
        ...expenses.map(e => ({ ...e, type: "Expense", description: e.description ?? e.source ?? "" })),
        ...incomes.map(i => ({ ...i, type: "Income", description: i.description ?? i.source ?? "" }))
    ];

    // Group into blocks by key
    const groups = {};
    items.forEach(item => {
        const k = getKey(item, period);
        if (!groups[k]) groups[k] = [];
        groups[k].push(item);
    });

    // Order: most recent on top
    const keys = Object.keys(groups).sort().reverse();

    const totalExpenses = expenses.reduce((total, expense) => total + expense.amount, 0);
    const totalIncomes = incomes.reduce((total, income) => total + income.amount, 0);
    const balance = totalIncomes - totalExpenses;

    if (keys.length === 0) {
        listContainer.innerHTML = "<p>No data to display.</p>";
    } else {
        let html = "";
        keys.forEach(k => {
            const rows = groups[k].map(item => `
                <tr>
                    <td>${item.type}</td>
                    <td>$${Number(item.amount).toFixed(2)}</td>
                    <td>${item.description}</td>
                    <td>${new Date(item.date).toLocaleDateString("en-US")}</td>
                    <td><button class="delete-button" data-id="${item.id}" data-type="${item.type === "Expense" ? "expense" : "income"}">Delete</button></td>
                </tr>`).join("");

            html += `
                <section class="report-block">
                    <h3 class="report-block-title">${formatTitle(k, period)}</h3>
                    <table class="report-block-table">
                        <thead>
                            <tr><th>Type</th><th>Amount</th><th>Description</th><th>Date</th><th>Options</th></tr>
                        </thead>
                        <tbody>${rows}</tbody>
                    </table>
                </section>`;
        });
        listContainer.innerHTML = html;
    }

    document.getElementById("total-amount").textContent = `Balance: $${balance.toFixed(2)}`;
}

loadTable(periodSelect.value);
