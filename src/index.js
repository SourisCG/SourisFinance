import { openDocumentHtml } from "./utilities/navegation.js";

const { invoke } = window.__TAURI__.core;

const expense = document.getElementById("expense");
const income = document.getElementById("income");
const reports = document.getElementById("reports");
const graphs = document.getElementById("graphs");
const archives = document.getElementById("archives");
const goals = document.getElementById("goals");

openDocumentHtml(expense);
openDocumentHtml(reports);
openDocumentHtml(graphs);
openDocumentHtml(archives);
openDocumentHtml(goals);