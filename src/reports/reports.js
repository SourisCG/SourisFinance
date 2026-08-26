import { getAllExpenses } from "../utilities/database.js";
import { getAllIncomes } from "../utilities/database.js";

const select = document.getElementById("time-selection");
const content = document.getElementById("report-container");

const pageSize = 5;
let currentPage = 0;
let lastKeys = [];
let lastGroups = {};
let lastPeriod = "days";

// Returns the Monday (start of the week) at 00:00
function startOfWeek(date) {
    const d = new Date(date);
    const day = (d.getDay() + 6) % 7;
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

async function renderReport(period) {
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

    lastPeriod = period;
    lastKeys = keys;
    lastGroups = groups;
    currentPage = 0;

    if (keys.length === 0) {
        content.innerHTML = "<p>No data to display.</p>";
        return;
    }

    paint();
}

function paint() {
    const totalPages = Math.ceil(lastKeys.length / pageSize);
    const start = currentPage * pageSize;
    const end = start + pageSize;
    const pageKeys = lastKeys.slice(start, end);

    let html = "";
    pageKeys.forEach(k => {
        const rows = lastGroups[k].map(item => `
            <tr>
                <td>${item.type}</td>
                <td>$${Number(item.amount).toFixed(2)}</td>
                <td>${item.description}</td>
            </tr>`).join("");

        html += `
            <section class="report-block">
                <h3 class="report-block-title">${formatTitle(k, lastPeriod)}</h3>
                <table class="report-block-table">
                    <thead>
                        <tr><th>Type</th><th>Amount</th><th>Description</th></tr>
                    </thead>
                    <tbody>${rows}</tbody>
                </table>
            </section>`;
    });

    html += `
        <div class="report-pagination">
            <button id="report-prev" ${currentPage === 0 ? "disabled" : ""}>Previous</button>
            <span>Page ${currentPage + 1} / ${totalPages}</span>
            <button id="report-next" ${end >= lastKeys.length ? "disabled" : ""}>Next</button>
        </div>`;

    content.innerHTML = html;

    const prev = document.getElementById("report-prev");
    const next = document.getElementById("report-next");
    if (prev) prev.addEventListener("click", () => {
        if (currentPage > 0) { currentPage--; paint(); }
    });
    if (next) next.addEventListener("click", () => {
        if (end < lastKeys.length) { currentPage++; paint(); }
    });
}

select.addEventListener("change", (e) => renderReport(e.target.value));
renderReport(select.value);
