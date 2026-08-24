import Database from "@tauri-apps/plugin-sql";

let db = null;

export async function getDb(){
    if(db){ return db; }
    db = await Database.load("sqlite:db.sourisfinance.db");

    try {
        await db.execute("CREATE TABLE IF NOT EXISTS expenses (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL, description TEXT, date TEXT)");
        await db.execute("CREATE TABLE IF NOT EXISTS incomes (id INTEGER PRIMARY KEY AUTOINCREMENT, amount REAL, source TEXT, date TEXT)");
        await db.execute("CREATE TABLE IF NOT EXISTS archives (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, path TEXT, date TEXT)");
        await db.execute("CREATE TABLE IF NOT EXISTS goals (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, target REAL, date TEXT)");
    } catch (error) {
        console.error("Error creating tables:", error);
    }

    return db;
}