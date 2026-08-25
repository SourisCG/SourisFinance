import Database from "@tauri-apps/plugin-sql";

let db = null;


// Function to get the database instance
export async function getDb(){
    if(db){ return db; }
    console.log("[DB] loading DB...");
    try {
        db = await Database.load("sqlite:db.sourisfinance.db");
        console.log("[DB] DB loaded, creating tables...");
        await db.execute("CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL, description TEXT, date TEXT)");
        await db.execute("CREATE TABLE IF NOT EXISTS incomes (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL, description TEXT, date TEXT)");
        await db.execute("CREATE TABLE IF NOT EXISTS archives (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, path TEXT, date TEXT)");
        await db.execute("CREATE TABLE IF NOT EXISTS goals (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, target REAL, date TEXT)");
        console.log("[DB] Tables ready");
    } catch (error) {
        console.error("[DB] Error creating tables: ", error);
        throw error;
    }

    return db;
}


// Function to insert or delete an expense and income into the database
export async function insertExpense(expense) {
    const db = await getDb();
    const { amount, description, date } = expense;
    try {
        await db.execute("INSERT INTO expenses (amount, description, date) VALUES (?, ?, ?)", [amount, description, date]);
        console.log("[DB] Expense inserted successfully");
    } catch (error) {
        console.error("[DB] Error inserting expense: ", error);
        throw error;
    }
}
export async function insertIncome(income) {
    const db = await getDb();
    const { amount, description, date } = income;
    try {
        await db.execute("INSERT INTO incomes (amount, description, date) VALUES (?, ?, ?)", [amount, description, date]);
        console.log("[DB] Income inserted successfully");
    } catch (error) {
        console.error("[DB] Error inserting income: ", error);
        throw error;
    }
}
export async function deleteExpense(expenseId) {
    const db = await getDb();
    try {
        await db.execute("DELETE FROM expenses WHERE id = ?", [expenseId]);
        console.log("[DB] Expense deleted successfully");
    } catch (error) {
        console.error("[DB] Error deleting expense: ", error);
        throw error;
    }
}
export async function deleteIncome(incomeId) {
    const db = await getDb();
    try {
        await db.execute("DELETE FROM incomes WHERE id = ?", [incomeId]);
        console.log("[DB] Income deleted successfully");
    } catch (error) {
        console.error("[DB] Error deleting income: ", error);
        throw error;
    }
}

// Function to retrieve all expenses and incomes from the database
export async function getAllExpenses() {
    const db = await getDb();
    try {
        const allExpenses = await db.select("SELECT * FROM expenses");
        return allExpenses;
    } catch (error) {
        console.error("[DB] Error retrieving expenses: ", error);
        throw error;
    }
}
export async function getAllIncomes() {
    const db = await getDb();
    try {
        const allIncomes = await db.select("SELECT * FROM incomes");
        return allIncomes;
    } catch (error) {
        console.error("[DB] Error retrieving incomes: ", error);
        throw error;
    }
}