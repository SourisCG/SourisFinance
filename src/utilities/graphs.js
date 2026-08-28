import { getAllExpenses, getAllIncomes } from "./database";
import { Chart, registerables } from "chart.js";

export async function loadData() {
    const expenses = await getAllExpenses();
    const incomes = await getAllIncomes();
    const data = [
        ...expenses.map((expense) => ({ ...expense, type: "Expense" })),
        ...incomes.map((income) => ({ ...income, type: "Income" }))
    ];
    return data;
}

export function getKey(item, period) {
    const f = new Date(item.date);
    switch (period) {
        case "days":
            return f.toISOString().slice(0, 10);
        case "weeks":
            const startOfWeek = new Date(f);
            startOfWeek.setDate(f.getDate() - (f.getDay() + 6) % 7);
            return startOfWeek.toISOString().slice(0, 10);
        case "months":
            return f.toISOString().slice(0, 7);
        default:
            return f.toISOString().split("T")[0];
    }
}

export async function renderChart(period, chart) {
    const data = await loadData();
    const chartData = data.reduce((acc, item) => {
        const key = getKey(item, period);
        if (!acc[key]) {
            acc[key] = { Expense: 0, Income: 0 };
        }
        acc[key][item.type] += item.amount;
        return acc;
    }, {});
    const todayDate = new Date().toISOString();
    const todayKey = getKey({ date: todayDate }, period);
    const todayData = chartData[todayKey] || { Expense: 0, Income: 0 };
    const labels = ["Income", "Expense"];
    const values = [todayData.Income, todayData.Expense];
    if (chart) {
        chart.destroy();
    }
chart = new Chart(document.getElementById("expense-income-graph"), {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                label: "Amount",
                data: values,
                backgroundColor: ["green", "red"]
            }]
        }
    });

    return chart;
}

export async function chartToBase64(period = "months") {
    Chart.register(...registerables);
    const data = await loadData();
    const chartData = data.reduce((acc, item) => {
        const key = getKey(item, period);
        if (!acc[key]) {
            acc[key] = { Expense: 0, Income: 0 };
        }
        acc[key][item.type] += item.amount;
        return acc;
    }, {});
}