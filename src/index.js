import { openDocumentHtml } from "./utilities/navegation.js";

const { invoke } = window.__TAURI__.core;

const expense = document.getElementById("expense");
const income = document.getElementById("income");
const reports = document.getElementById("reports");
const graphs = document.getElementById("graphs");
const archives = document.getElementById("archives");
const goals = document.getElementById("goals");

expense.addEventListener("click", () => {
    openDocumentHtml("expense/expense.html");
});
expense.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        openDocumentHtml("expense/expense.html");
    }
});

income.addEventListener("click", () => {
    openDocumentHtml("income/income.html");
});
income.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        openDocumentHtml("income/income.html");
    }
});

reports.addEventListener("click", () => {
    openDocumentHtml("reports/reports.html");
});
reports.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        openDocumentHtml("reports/reports.html");
    }
});

graphs.addEventListener("click", () => {
    openDocumentHtml("graphs/graphs.html");
});
graphs.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        openDocumentHtml("graphs/graphs.html");
    }
});

archives.addEventListener("click", () => {
    openDocumentHtml("archives/archives.html");
});
archives.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        openDocumentHtml("archives/archives.html");
    }
});

goals.addEventListener("click", () => {
    openDocumentHtml("goals/goals.html");
});
goals.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
        openDocumentHtml("goals/goals.html");
    }
});
