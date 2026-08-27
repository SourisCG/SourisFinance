import { Chart, registerables } from "chart.js";
import { renderChart } from "../utilities/graphs.js";

Chart.register(...registerables);

const periodSelect = document.getElementById("period-select");
let chart = null;

periodSelect.addEventListener("change", async (e) => {
    const period = e.target.value;
    chart = await renderChart(period, chart);
});

chart = await renderChart(periodSelect.value, chart);